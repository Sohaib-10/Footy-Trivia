"""Generate favicon assets from the icon-only logo, recolored to site brand green."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "logo_icon.png"
BRAND_GREEN = np.array([0, 61, 41], dtype=np.uint8)  # #003d29 — site --logo-brand
OUTLINE_ALPHA = 72  # ~28% white — minimal tab outline only


def load_icon() -> Image.Image:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)

    min_ch = rgb.min(axis=2)
    alpha = 1.0 - (min_ch / 255.0)
    lo = 0.18
    alpha = np.clip((alpha - lo) / (1.0 - lo), 0.0, 1.0)

    mask = alpha > 0.08
    ys, xs = np.where(mask)
    if ys.size == 0:
        raise RuntimeError(f"No icon pixels found in {SRC}")

    pad = max(8, int(max(xs.max() - xs.min(), ys.max() - ys.min()) * 0.06))
    x0, x1 = max(0, xs.min() - pad), min(rgb.shape[1], xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(rgb.shape[0], ys.max() + pad + 1)

    cropped_alpha = alpha[y0:y1, x0:x1]
    alpha_u8 = (cropped_alpha * 255).astype(np.uint8)
    alpha_u8 = np.where(alpha_u8 >= 96, 255, 0).astype(np.uint8)

    h, w = alpha_u8.shape
    icon = np.zeros((h, w, 4), dtype=np.uint8)
    icon[:, :, :3] = BRAND_GREEN
    icon[:, :, 3] = alpha_u8

    side = max(w, h)
    square = np.zeros((side, side, 4), dtype=np.uint8)
    offset_y = (side - h) // 2
    offset_x = (side - w) // 2
    square[offset_y : offset_y + h, offset_x : offset_x + w] = icon
    return Image.fromarray(square, mode="RGBA")


def _harden_edges(img: Image.Image) -> Image.Image:
    arr = np.asarray(img).copy()
    arr[:, :, 3] = np.where(arr[:, :, 3] >= 64, 255, 0).astype(np.uint8)
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3:4].astype(np.float32) / 255.0
    arr[:, :, :3] = np.clip(rgb * alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, mode="RGBA")


def _dilate_mask(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    out = mask.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            shifted = np.zeros_like(mask)
            sy0, sy1 = max(0, dy), min(h, h + dy)
            sx0, sx1 = max(0, dx), min(w, w + dx)
            ty0, ty1 = max(0, -dy), min(h, h - dy)
            tx0, tx1 = max(0, -dx), min(w, w - dx)
            shifted[ty0:ty1, tx0:tx1] = mask[sy0:sy1, sx0:sx1]
            out |= shifted
    return out


def _add_minimal_outline(img: Image.Image) -> Image.Image:
    arr = np.asarray(img)
    solid = arr[:, :, 3] >= 128
    ring = _dilate_mask(solid) & ~solid

    outline = np.zeros_like(arr)
    outline[ring] = (255, 255, 255, OUTLINE_ALPHA)

    composed = Image.fromarray(outline, mode="RGBA")
    composed.alpha_composite(Image.fromarray(arr, mode="RGBA"))
    return composed


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
        if size <= 180:
            out = _harden_edges(out)
            out = _add_minimal_outline(out)
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
