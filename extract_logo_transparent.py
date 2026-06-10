"""Remove the white background from the logo while preserving smooth,
anti-aliased edges (no white halo) via alpha un-premultiplication."""
import numpy as np
from PIL import Image

SRC = "logo_source.png"
OUT = "logo_hd.png"

img = Image.open(SRC).convert("RGB")
arr = np.asarray(img).astype(np.float32)

# Coverage estimate: white background -> alpha 0, dark logo -> alpha ~1.
min_ch = arr.min(axis=2)
alpha = 1.0 - (min_ch / 255.0)

# Clear faint near-white background noise while preserving anti-aliased edges.
lo = 0.14
alpha = np.clip((alpha - lo) / (1.0 - lo), 0.0, 1.0)

# Un-premultiply against a white background to recover true foreground color:
#   observed = a*F + (1-a)*255  ->  F = (observed - (1-a)*255) / a
a = np.clip(alpha, 1e-4, 1.0)[..., None]
fg = (arr - (1.0 - a) * 255.0) / a
fg = np.clip(fg, 0, 255)

out = np.dstack([fg, np.clip(alpha * 255.0, 0, 255)]).astype(np.uint8)
Image.fromarray(out, mode="RGBA").save(OUT, optimize=True)
print(f"Saved transparent logo: {OUT}  size={img.size}")
