// Modular Python sources for torchstub. Web Worker loads these without fetch().
//
// `torchstub` is a fake `torch.nn` that does SHAPE INFERENCE ONLY — no tensor math.
// Tensors carry a `.shape` and nothing else; each layer computes its output shape and
// parameter count, and `Module.__call__` traces calls into a GraphRecorder to build the
// IR that drives the 3D diagram.
//
// To add a new layer: define a `Module` subclass with a `forward` that calls `_record(...)`,
// add it to `Module._leaf_types` (PY_NN_LEAF_TYPES), and give it a color in constants.ts.
// Full walkthrough: docs/TORCHSTUB.md. Big picture: docs/ARCHITECTURE.md.

export const PY_INIT = `
__all__ = ["nn", "Tensor", "randn", "cat", "add"]
from .tensor import Tensor
from . import nn
from .ops import *
`;

export const PY_TENSOR = `
import uuid

class Tensor:
    def __init__(self, shape, dtype="float32", _id=None):
        self.shape = tuple(shape)
        self.dtype = dtype
        self.id = _id if _id else str(uuid.uuid4())[:8]

    def size(self, dim=None):
        if dim is None:
            return self.shape
        return self.shape[dim]
    
    def dim(self):
        return len(self.shape)

    def view(self, *shape):
        from .ops import view
        return view(self, *shape)
    
    def reshape(self, *shape):
        from .ops import view
        return view(self, *shape)
        
    def flatten(self, start_dim=0, end_dim=-1):
        from .ops import flatten
        return flatten(self, start_dim, end_dim)
        
    def permute(self, *dims):
        from .ops import permute
        return permute(self, *dims)

    def __repr__(self):
        return f"Tensor({self.shape})"
        
    def __add__(self, other):
        from .ops import add
        return add(self, other)

    def __getitem__(self, idx):
        from .ops import _record
        current_shape = list(self.shape)
        if not isinstance(idx, tuple):
            idx = (idx,)
        new_shape = []
        dim_counter = 0
        has_ellipsis = any(item is Ellipsis for item in idx)
        
        for item in idx:
            if item is Ellipsis:
                remaining_dims_in_idx = len(idx) - (idx.index(Ellipsis) + 1)
                dims_to_copy = len(current_shape) - dim_counter - remaining_dims_in_idx
                for _ in range(dims_to_copy):
                    new_shape.append(current_shape[dim_counter])
                    dim_counter += 1
                continue
            if dim_counter >= len(current_shape):
                break
            if isinstance(item, int):
                dim_counter += 1
                continue
            if isinstance(item, slice):
                start = item.start if item.start is not None else 0
                stop = item.stop if item.stop is not None else current_shape[dim_counter]
                step = item.step if item.step is not None else 1
                dim_len = current_shape[dim_counter]
                if start < 0: start += dim_len
                if stop < 0: stop += dim_len
                start = max(0, min(start, dim_len))
                stop = max(0, min(stop, dim_len))
                if step > 0:
                    new_len = max(0, (stop - start + (step - 1)) // step)
                else:
                    new_len = max(0, (start - stop + (-step - 1)) // (-step))
                new_shape.append(new_len)
                dim_counter += 1
                continue
        while dim_counter < len(current_shape):
             new_shape.append(current_shape[dim_counter])
             dim_counter += 1
        return _record("Slice", [self], tuple(new_shape))
`;

export const PY_OPS = `
from .tensor import Tensor
from .recorder import get_recorder, GraphError
import math

def _record(op_type, inputs, out_shape, params=0, meta=None, error=None):
    rec = get_recorder()
    out_tensor = Tensor(out_shape)
    rec.add_node(op_type, inputs, out_tensor, params, meta, error)
    if error:
        raise GraphError(error)
    return out_tensor

def relu(x):
    return _record("ReLU", [x], x.shape)

def gelu(x):
    return _record("GELU", [x], x.shape)

def silu(x):
    return _record("SiLU", [x], x.shape)

def sigmoid(x):
    return _record("Sigmoid", [x], x.shape)

def tanh(x):
    return _record("Tanh", [x], x.shape)

def softmax(x, dim=-1):
    return _record("Softmax", [x], x.shape)

def flatten(x, start_dim=0, end_dim=-1):
    shape = list(x.shape)
    if end_dim == -1: end_dim = len(shape) - 1
    new_shape = shape[:start_dim]
    flat_dim = 1
    for s in shape[start_dim:end_dim+1]:
        flat_dim *= s
    new_shape.append(flat_dim)
    new_shape.extend(shape[end_dim+1:])
    return _record("Flatten", [x], tuple(new_shape))

def view(x, *shape):
    target = list(shape)
    total_elements = 1
    for s in x.shape: total_elements *= s
    neg_idx = -1
    current_prod = 1
    for i, s in enumerate(target):
        if s == -1:
            neg_idx = i
        else:
            current_prod *= s
    if neg_idx != -1:
        target[neg_idx] = total_elements // current_prod
    return _record("Reshape", [x], tuple(target))

def permute(x, *dims):
    new_shape = [x.shape[d] for d in dims]
    return _record("Permute", [x], tuple(new_shape))

def add(a, b):
    return _record("Add", [a, b], a.shape)

def cat(tensors, dim=0):
    if not tensors: return Tensor((0,))
    base_shape = list(tensors[0].shape)
    total = 0
    for t in tensors:
        total += t.shape[dim]
    base_shape[dim] = total
    return _record("Concat", tensors, tuple(base_shape))

def matmul(a, b):
    out = list(a.shape)
    out[-1] = b.shape[-1]
    if a.shape[-1] != b.shape[-2]:
        return _record("MatMul", [a, b], tuple(out),
            error=f"Shape Mismatch: matmul {tuple(a.shape)} @ {tuple(b.shape)}")
    return _record("MatMul", [a, b], tuple(out))

def randn(*shape):
    return Tensor(shape)
`;

export const PY_RECORDER = `
import inspect
import sys

class GraphError(Exception):
    pass

class GraphRecorder:
    def __init__(self):
        self.reset()

    def reset(self):
        self.edges = []
        self.tensor_map = {}
        self.id_counter = 0
        self.scope_stack = []
        self.root_children = []
        self.error_node_id = None
        self.execution_error = None

    def _current_children(self):
        if self.scope_stack:
            return self.scope_stack[-1]["children"]
        return self.root_children

    def push_scope(self, name, op_type, lineno=0):
        node_id = f"node_{self.id_counter}"
        self.id_counter += 1
        container = {
            "id": node_id,
            "name": f"{op_type}_{self.id_counter}",
            "op_type": op_type,
            "children": [],
            "params": 0,
            "in_shape": [],
            "out_shape": [],
            "lineno": lineno,
            "meta": {},
            "is_container": True,
            "collapsed": True,
        }
        self._current_children().append(container)
        self.scope_stack.append(container)
        return container

    def pop_scope(self, output_tensor=None, in_shape=None):
        if not self.scope_stack:
            return None
        container = self.scope_stack.pop()
        if output_tensor:
            container["out_shape"] = list(output_tensor.shape)
            self.tensor_map[output_tensor.id] = container["id"]
        if in_shape:
            container["in_shape"] = list(in_shape)
        total = 0
        for c in container.get("children", []):
            total += c.get("params", 0)
        container["params"] = total
        return container

    def _get_lineno(self):
        stack = inspect.stack()
        for frame in stack:
            if "pyodide_kernel" in frame.filename or "<exec>" in frame.filename:
                return frame.lineno
        return 0

    def add_node(self, op_type, inputs, output, params=0, meta=None, error=None):
        node_id = f"node_{self.id_counter}"
        self.id_counter += 1
        for inp in inputs:
            if hasattr(inp, 'id') and inp.id in self.tensor_map:
                from_node = self.tensor_map[inp.id]
                edge_kind = "main"
                if op_type == "Add": edge_kind = "residual"
                elif op_type == "Concat": edge_kind = "concat"
                self.edges.append({"from": from_node, "to": node_id, "kind": edge_kind})
        node = {
            "id": node_id,
            "name": f"{op_type}_{self.id_counter}",
            "op_type": op_type,
            "params": params,
            "in_shape": list(inputs[0].shape) if inputs else [],
            "out_shape": list(output.shape),
            "lineno": self._get_lineno(),
            "meta": meta or {},
        }
        if error:
            node["error"] = error
            self.error_node_id = node_id
        self._current_children().append(node)
        self.tensor_map[output.id] = node_id
        return node_id

    def to_dict(self):
        total_params = sum(n.get("params", 0) for n in self.root_children)
        result = {
            "nodes": self.root_children,
            "edges": self.edges,
            "stats": {"total_params": total_params, "approx_memory_mb": 0},
        }
        if self.error_node_id:
            result["error_node_id"] = self.error_node_id
        if self.execution_error:
            result["error"] = self.execution_error
        return result

_instance = GraphRecorder()
def get_recorder():
    return _instance
`;

const PY_NN_IMPORTS = `
from ..tensor import Tensor
from ..ops import _record
from ..recorder import get_recorder, GraphError
import math
`;

const PY_NN_MODULE = `
class Module:
    _leaf_types = set()

    def __init__(self):
        self._modules = {}

    def __setattr__(self, name, value):
        if isinstance(value, Module):
            self._modules[name] = value
        super().__setattr__(name, value)

    def __call__(self, *args, **kwargs):
        if type(self) not in Module._leaf_types:
            rec = get_recorder()
            cls_name = type(self).__name__
            lineno = rec._get_lineno()
            in_shape = list(args[0].shape) if args and hasattr(args[0], 'shape') else []
            container = rec.push_scope(cls_name, cls_name, lineno)
            container["in_shape"] = in_shape
            try:
                result = self.forward(*args, **kwargs)
                rec.pop_scope(result, in_shape)
                return result
            except GraphError:
                popped = rec.pop_scope(None, in_shape)
                if popped:
                    popped["has_error"] = True
                raise
        return self.forward(*args, **kwargs)

    def forward(self, x):
        return x
`;

const PY_NN_CONV = `
class Conv2d(Module):
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride = stride
        self.padding = padding
        k = self.kernel_size
        self.params = (k[0] * k[1] * in_channels + 1) * out_channels

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("Conv2d", [x], x.shape, self.params,
                {"kernel": self.kernel_size, "stride": self.stride},
                error=f"Shape Mismatch: Conv2d expects 4D input [N,C,H,W], got {len(x.shape)}D {tuple(x.shape)}")
        h_out = math.floor((x.shape[2] + 2 * self.padding - self.kernel_size[0]) / self.stride + 1)
        w_out = math.floor((x.shape[3] + 2 * self.padding - self.kernel_size[1]) / self.stride + 1)
        out_shape = (x.shape[0], self.out_channels, h_out, w_out)
        return _record("Conv2d", [x], out_shape, self.params,
                       {"kernel": self.kernel_size, "stride": self.stride})
`;

const PY_NN_LINEAR = `
class Linear(Module):
    def __init__(self, in_features, out_features):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.params = (in_features + 1) * out_features

    def forward(self, x):
        out_shape = list(x.shape)
        out_shape[-1] = self.out_features
        if x.shape[-1] != self.in_features:
            return _record("Linear", [x], tuple(out_shape), self.params,
                error=f"Shape Mismatch: Linear expects input dim {self.in_features}, got {x.shape[-1]}")
        return _record("Linear", [x], tuple(out_shape), self.params)
`;

const PY_NN_POOL = `
class MaxPool2d(Module):
    def __init__(self, kernel_size, stride=None, padding=0):
        super().__init__()
        self.kernel_size = kernel_size
        self.stride = stride if stride is not None else kernel_size
        self.padding = padding

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("MaxPool", [x], x.shape,
                error=f"Shape Mismatch: MaxPool2d expects 4D input, got {len(x.shape)}D")
        ks, st = self.kernel_size, self.stride
        h_out = math.floor((x.shape[2] + 2 * self.padding - ks) / st + 1)
        w_out = math.floor((x.shape[3] + 2 * self.padding - ks) / st + 1)
        out_shape = (x.shape[0], x.shape[1], h_out, w_out)
        return _record("MaxPool", [x], out_shape)

class AvgPool2d(Module):
    def __init__(self, kernel_size, stride=None, padding=0):
        super().__init__()
        self.kernel_size = kernel_size
        self.stride = stride if stride is not None else kernel_size
        self.padding = padding

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("AvgPool", [x], x.shape,
                error=f"Shape Mismatch: AvgPool2d expects 4D input, got {len(x.shape)}D")
        ks, st = self.kernel_size, self.stride
        h_out = math.floor((x.shape[2] + 2 * self.padding - ks) / st + 1)
        w_out = math.floor((x.shape[3] + 2 * self.padding - ks) / st + 1)
        out_shape = (x.shape[0], x.shape[1], h_out, w_out)
        return _record("AvgPool", [x], out_shape)

class AdaptiveAvgPool2d(Module):
    def __init__(self, output_size):
        super().__init__()
        self.output_size = output_size if isinstance(output_size, tuple) else (output_size, output_size)

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("AdaptiveAvgPool", [x], x.shape,
                error=f"Shape Mismatch: AdaptiveAvgPool2d expects 4D input, got {len(x.shape)}D")
        out_shape = (x.shape[0], x.shape[1], self.output_size[0], self.output_size[1])
        return _record("AdaptiveAvgPool", [x], out_shape)
`;

const PY_NN_NORM_ACT = `
class BatchNorm2d(Module):
    def __init__(self, num_features):
        super().__init__()
        self.params = num_features * 2
    def forward(self, x):
        return _record("BatchNorm", [x], x.shape, self.params)

class LayerNorm(Module):
    def __init__(self, normalized_shape):
        super().__init__()
        dim = normalized_shape if isinstance(normalized_shape, int) else normalized_shape[0]
        self.params = dim * 2
    def forward(self, x):
        return _record("LayerNorm", [x], x.shape, self.params)

class GELU(Module):
    def forward(self, x):
        return _record("GELU", [x], x.shape)

class SiLU(Module):
    def forward(self, x):
        return _record("SiLU", [x], x.shape)

class ReLU(Module):
    def forward(self, x):
        return _record("ReLU", [x], x.shape)

class Dropout(Module):
    def __init__(self, p=0.5):
        super().__init__()
        self.p = p
    def forward(self, x):
        return _record("Dropout", [x], x.shape, 0, {"p": self.p})

class Sigmoid(Module):
    def forward(self, x):
        return _record("Sigmoid", [x], x.shape)

class Tanh(Module):
    def forward(self, x):
        return _record("Tanh", [x], x.shape)

class Softmax(Module):
    def __init__(self, dim=-1):
        super().__init__()
    def forward(self, x):
        return _record("Softmax", [x], x.shape)

class Flatten(Module):
    def forward(self, x):
        from ..ops import flatten
        return flatten(x, 1)
`;

const PY_NN_EXTRA = `
class Sequential(Module):
    def __init__(self, *args):
        super().__init__()
        self.layers = args

    def __call__(self, *args, **kwargs):
        if not self.layers:
            return args[0] if args else None
        return Module.__call__(self, *args, **kwargs)

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

class MultiheadAttention(Module):
    def __init__(self, embed_dim, num_heads):
        super().__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.params = 4 * (embed_dim * embed_dim + embed_dim)

    def forward(self, query, key, value, attn_mask=None):
        return _record("MultiHeadAttn", [query], query.shape, self.params, {"heads": self.num_heads})

class Embedding(Module):
    def __init__(self, num_embeddings, embedding_dim):
        super().__init__()
        self.num_embeddings = num_embeddings
        self.embedding_dim = embedding_dim
        self.params = num_embeddings * embedding_dim

    def forward(self, x):
        out_shape = tuple(list(x.shape) + [self.embedding_dim])
        return _record("Embedding", [x], out_shape, self.params)

class RNN(Module):
    def __init__(self, input_size, hidden_size, num_layers=1):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.params = (input_size * hidden_size + hidden_size * hidden_size + 2 * hidden_size) * num_layers

    def forward(self, x, h=None):
        batch = x.shape[1] if len(x.shape) > 1 else x.shape[0]
        seq_len = x.shape[0] if len(x.shape) > 1 else 1
        out_shape = (seq_len, batch, self.hidden_size)
        return _record("RNN", [x], out_shape, self.params)

class LSTM(Module):
    def __init__(self, input_size, hidden_size, num_layers=1):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.params = 4 * (input_size * hidden_size + hidden_size * hidden_size + 2 * hidden_size) * num_layers

    def forward(self, x, h=None):
        batch = x.shape[1] if len(x.shape) > 1 else x.shape[0]
        seq_len = x.shape[0] if len(x.shape) > 1 else 1
        out_shape = (seq_len, batch, self.hidden_size)
        return _record("LSTM", [x], out_shape, self.params)

class GRU(Module):
    def __init__(self, input_size, hidden_size, num_layers=1):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.params = 3 * (input_size * hidden_size + hidden_size * hidden_size + 2 * hidden_size) * num_layers

    def forward(self, x, h=None):
        batch = x.shape[1] if len(x.shape) > 1 else x.shape[0]
        seq_len = x.shape[0] if len(x.shape) > 1 else 1
        out_shape = (seq_len, batch, self.hidden_size)
        return _record("GRU", [x], out_shape, self.params)

class PixelShuffle(Module):
    def __init__(self, upscale_factor):
        super().__init__()
        self.upscale_factor = upscale_factor if isinstance(upscale_factor, int) else (upscale_factor[0] if isinstance(upscale_factor, (list, tuple)) else 2)

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("PixelShuffle", [x], x.shape,
                error=f"Shape Mismatch: PixelShuffle expects 4D input [N,C,H,W], got {len(x.shape)}D")
        r = self.upscale_factor
        c_ratio = x.shape[1] // (r * r)
        if c_ratio < 1:
            return _record("PixelShuffle", [x], x.shape,
                error=f"PixelShuffle: channels {x.shape[1]} must be divisible by r^2={r*r}")
        out_shape = (x.shape[0], c_ratio, x.shape[2] * r, x.shape[3] * r)
        return _record("PixelShuffle", [x], out_shape)

class Upsample(Module):
    def __init__(self, size=None, scale_factor=None, mode='nearest'):
        super().__init__()
        self.scale_factor = scale_factor if isinstance(scale_factor, (int, float)) else (scale_factor[0] if scale_factor else 2)

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("Upsample", [x], x.shape)
        sf = self.scale_factor
        out_shape = (x.shape[0], x.shape[1], int(x.shape[2] * sf), int(x.shape[3] * sf))
        return _record("Upsample", [x], out_shape)
`;

const PY_NN_LEAF_TYPES = `
Module._leaf_types = {Conv2d, Linear, MaxPool2d, AvgPool2d, AdaptiveAvgPool2d,
                      BatchNorm2d, LayerNorm, ReLU, GELU, SiLU, Sigmoid, Tanh, Softmax, Dropout, Flatten,
                      MultiheadAttention, Embedding, RNN, LSTM, GRU, PixelShuffle, Upsample}
`;

export const PY_NN_INIT = [
  PY_NN_IMPORTS,
  PY_NN_MODULE,
  PY_NN_CONV,
  PY_NN_LINEAR,
  PY_NN_POOL,
  PY_NN_NORM_ACT,
  PY_NN_EXTRA,
  PY_NN_LEAF_TYPES,
].join('\n');
