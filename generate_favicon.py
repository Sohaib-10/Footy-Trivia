"""Generate favicon assets from the icon-only logo, recolored to site accent green."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "logo_icon.png"
BRAND_GREEN = (34, 197, 94, 255)  # #22c55e — matches site --green accent


def load_icon() -> Image.Image:
    img = Image.open(SRC).convert("RGBA")
    arr = np.asarray(img).astype(np.float32)

    # White/light background -> transparent; keep the dark-green icon strokes.
    min_ch = arr[:, :, :3].min(axis=2)
    alpha = np.clip(1.0 - (min_ch / 255.0), 0.0, 1.0)
    alpha = np.where(min_ch < 200, np.maximum(alpha, 0.85), alpha)
    alpha = np.where(min_ch > 240, 0.0, alpha)
    alpha = np.clip(alpha, 0.0, 1.0)

    mask = alpha > 0.08
    ys, xs = np.where(mask)
    if ys.size == 0:
        raise RuntimeError(f"No icon pixels found in {SRC}")

    pad = max(8, int(max(xs.max() - xs.min(), ys.max() - ys.min()) * 0.06))
    x0, x1 = max(0, xs.min() - pad), min(arr.shape[1], xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(arr.shape[0], ys.max() + pad + 1)

    cropped_alpha = alpha[y0:y1, x0:x1]
    h, w = cropped_alpha.shape
    icon = np.zeros((h, w, 4), dtype=np.uint8)
    icon[:, :, :3] = np.array(BRAND_GREEN[:3], dtype=np.uint8)
    icon[:, :, 3] = (cropped_alpha * 255).astype(np.uint8)

    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    offset = ((side - w) // 2, (side - h) // 2)
    square.paste(Image.fromarray(icon, mode="RGBA"), offset)
    return square


def save_assets(icon: Image.Image) -> None:
    sizes = {
        "favicon-16.png": 16,
        "favicon-32.png": 32,
        "favicon-48.png": 48,
        "apple-touch-icon.png": 180,
        "favicon-512.png": 512,
    }
    pngs = []
    for name, size in sizes.items():
        out = icon.resize((size, size), Image.Resampling.LANCZOS)
        path = ROOT / name
        out.save(path, format="PNG", optimize=True)
        pngs.append(out)
        print(f"Saved {path.name} ({size}x{size})")

    ico_path = ROOT / "favicon.ico"
    pngs[1].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print(f"Saved {ico_path.name}")


if __name__ == "__main__":
    save_assets(load_icon())
