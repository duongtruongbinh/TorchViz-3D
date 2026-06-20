
import { PY_INIT, PY_NN_INIT, PY_OPS, PY_RECORDER, PY_TENSOR } from '../lib/python_sources';
import { countPythonPreambleLines } from '../lib/workerLineMapping';

const USER_CODE_PREAMBLE = `import torchstub
import torchstub.nn as nn
import torchstub.nn.functional as F
from torchstub import Tensor
import math

`;
const USER_CODE_PREAMBLE_LINE_COUNT = countPythonPreambleLines(USER_CODE_PREAMBLE);

export function createWorker(): Worker {
  // We explicitly inline the python sources into the worker script string.
  // This avoids passing complex objects via postMessage or import issues.
  const pythonSources = {
    PY_INIT,
    PY_NN_INIT,
    PY_OPS,
    PY_RECORDER,
    PY_TENSOR
  };

  const workerCode = `
    // Pyodide loading logic with fallback
    let pyodideIndexUrl = "";
    const cdnSources = [
      { 
        script: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js", 
        index: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" 
      },
      { 
        script: "https://unpkg.com/pyodide@0.25.1/pyodide.js", 
        index: "https://unpkg.com/pyodide@0.25.1/" 
      },
      {
        script: "https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js", 
        index: "https://pyodide-cdn2.iodide.io/v0.15.0/full/" 
      }
    ];

    let loaded = false;
    let loadError = null;

    // Try to load Pyodide from available CDNs
    async function loadPyodideScript() {
      for (const src of cdnSources) {
        try {
          // In a worker, we must use importScripts
          importScripts(src.script);
          // Check if it loaded by looking for the global loadPyodide function
          if (typeof loadPyodide !== 'undefined') {
            pyodideIndexUrl = src.index;
            loaded = true;
            return;
          }
        } catch (e) {
          console.warn("Failed to load Pyodide from " + src.script, e);
          loadError = e;
        }
      }
    }

    // Wrap execution
    (async function() {
       await loadPyodideScript();
    })();

    const PYTHON_SOURCES = ${JSON.stringify(pythonSources)};
    let pyodide = null;

    async function setupPyodide() {
      if (!loaded) {
         throw new Error("Could not load Pyodide from any CDN. Please check your internet connection or firewall.");
      }
      
      if (pyodide) return pyodide;
      
      // Explicitly provide indexURL so Pyodide knows where to fetch .wasm files
      pyodide = await loadPyodide({
        indexURL: pyodideIndexUrl
      });
      
      // Setup torchstub virtual package
      pyodide.FS.mkdir('/home/pyodide/torchstub');
      pyodide.FS.mkdir('/home/pyodide/torchstub/nn');
      
      pyodide.FS.writeFile('/home/pyodide/torchstub/__init__.py', PYTHON_SOURCES.PY_INIT);
      pyodide.FS.writeFile('/home/pyodide/torchstub/tensor.py', PYTHON_SOURCES.PY_TENSOR);
      pyodide.FS.writeFile('/home/pyodide/torchstub/ops.py', PYTHON_SOURCES.PY_OPS);
      pyodide.FS.writeFile('/home/pyodide/torchstub/recorder.py', PYTHON_SOURCES.PY_RECORDER);
      pyodide.FS.writeFile('/home/pyodide/torchstub/nn/__init__.py', PYTHON_SOURCES.PY_NN_INIT);
      
      // FIX: Add functional.py by aliasing ops, allowing 'import torchstub.nn.functional as F'
      pyodide.FS.writeFile('/home/pyodide/torchstub/nn/functional.py', 'from ..ops import *');
      
      await pyodide.loadPackage(['micropip']);
      return pyodide;
    }

    const USER_CODE_PREAMBLE = ${JSON.stringify(USER_CODE_PREAMBLE)};
    const WRAPPER_LINE_OFFSET = ${USER_CODE_PREAMBLE_LINE_COUNT};

    function toUserLineno(wrappedLine) {
      return Math.max(1, wrappedLine - WRAPPER_LINE_OFFSET);
    }

    function parseErrorLineno(msg) {
      const match = msg.match(/File "<exec>", line (\\d+)/);
      if (match) {
        return toUserLineno(parseInt(match[1]));
      }
      return 0;
    }

    function adjustNodeLinenos(nodes, offset) {
      if (!nodes) return;
      for (const n of nodes) {
        if (n.lineno && n.lineno > 0) {
              n.lineno = Math.max(1, n.lineno - offset);
        }
        if (n.children) adjustNodeLinenos(n.children, offset);
      }
    }

    const extractionCode = \`
import json
import torchstub.recorder
rec = torchstub.recorder.get_recorder()
json.dumps(rec.to_dict())
\`;

    self.onmessage = async (e) => {
      const { code, inputShape, requestId } = e.data;
      
      try {
        const py = await setupPyodide();

        py.runPython(\`
import torchstub.recorder
torchstub.recorder.get_recorder().reset()
        \`);

        const wrappedCode = \`\${USER_CODE_PREAMBLE}\${code}

if 'model' not in locals():
    if 'Net' in locals():
        model = Net()
    elif 'build_model' in locals():
        model = build_model()
    else:
        raise ValueError("Code must define 'model = ...' or class Net or function build_model()")

input_dims = \${JSON.stringify(inputShape)}
x = Tensor(input_dims)
try:
    model(x)
except Exception as _tvs_err:
    import traceback as _tvs_tb
    _tvs_lineno = 0
    for _tvs_line in _tvs_tb.format_exc().splitlines():
        if '<exec>' in _tvs_line and 'line' in _tvs_line:
            try:
                _tvs_parts = _tvs_line.split('line ')
                if len(_tvs_parts) > 1:
                    _tvs_lineno = int(_tvs_parts[1].split(',')[0].strip())
            except Exception:
                pass
    torchstub.recorder.get_recorder().execution_error = {
        "message": str(_tvs_err),
        "lineno": _tvs_lineno,
        "hint": "Check tensor shapes and dimensions",
    }
\`;

        let runError = null;
        try {
          py.runPython(wrappedCode);
        } catch (err) {
          runError = err;
        }

        try {
          const irJson = py.runPython(extractionCode);
          const data = JSON.parse(irJson);
          adjustNodeLinenos(data.nodes, WRAPPER_LINE_OFFSET);

          if (data.error) {
            if (data.error.lineno) {
              data.error.lineno = toUserLineno(data.error.lineno);
            }
            data.error.hint = data.error.hint || "Check tensor shapes";
          } else if (runError) {
            const msg = runError.message || "Unknown error";
            data.error = {
              message: msg.split('\\n').slice(-2).join('\\n'),
              lineno: parseErrorLineno(msg),
              hint: "Check shapes or syntax.",
            };
          }

          if (data.error) {
            self.postMessage({ type: 'partial', data, requestId });
          } else {
            self.postMessage({ type: 'success', data, requestId });
          }
        } catch (extractErr) {
          const msg = (runError || extractErr).message || "Unknown error";
          self.postMessage({
            type: 'error',
            requestId,
            error: {
              message: msg.split('\\n').slice(-2).join('\\n'),
              lineno: parseErrorLineno(msg),
              hint: "Check shapes or syntax. (Network error? " + (!loaded) + ")",
            },
          });
        }

      } catch (err) {
        const msg = err.message || "Unknown error";
        self.postMessage({
          type: 'error',
          requestId,
          error: {
            message: msg.split('\\n').slice(-2).join('\\n'),
            lineno: parseErrorLineno(msg),
            hint: "Check shapes or syntax. (Network error? " + (!loaded) + ")",
          },
        });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}
