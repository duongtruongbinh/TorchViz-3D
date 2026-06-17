
export default `import torchstub.nn as nn
from torchstub import cat

class PatchEmbedding(nn.Module):
    def __init__(self, in_channels=3, patch_size=4, embed_dim=32):
        super().__init__()
        self.proj = nn.Conv2d(in_channels, embed_dim, kernel_size=patch_size, stride=patch_size)

    def forward(self, x):
        x = self.proj(x) # (B, E, H', W')
        x = x.flatten(2) # (B, E, L)
        x = x.permute(0, 2, 1) # (B, L, E)
        return x

class TransformerBlock(nn.Module):
    def __init__(self, dim, num_heads):
        super().__init__()
        self.norm1 = nn.LayerNorm(dim)
        self.attn = nn.MultiheadAttention(dim, num_heads)
        self.norm2 = nn.LayerNorm(dim)
        self.mlp = nn.Sequential(
            nn.Linear(dim, dim * 4),
            nn.GELU(),
            nn.Linear(dim * 4, dim)
        )

    def forward(self, x):
        # Attention with residual
        x_norm = self.norm1(x)
        attn_out = self.attn(x_norm, x_norm, x_norm)
        x = x + attn_out
        
        # MLP with residual
        mlp_in = self.norm2(x)
        mlp_out = self.mlp(mlp_in)
        x = x + mlp_out
        return x

class MiniViT(nn.Module):
    def __init__(self):
        super().__init__()
        self.patch_embed = PatchEmbedding()
        self.cls_token = nn.Tensor((1, 1, 32)) # Dummy for viz
        
        self.blocks = nn.Sequential(
            TransformerBlock(dim=32, num_heads=4),
            TransformerBlock(dim=32, num_heads=4)
        )
        self.head = nn.Linear(32, 10)

    def forward(self, x):
        x = self.patch_embed(x)
        
        # Simplified CLS token append for visualization (ignoring batch broadcast complexity)
        # In real torch this needs expansion
        # x = cat([self.cls_token, x], dim=1) 
        
        x = self.blocks(x)
        
        # Classify first token
        # x = x[:, 0]
        # Simplified:
        x = x[:, 0, :]
        x = self.head(x)
        return x

model = MiniViT()`;
