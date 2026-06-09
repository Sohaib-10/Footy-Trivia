"""Generate clean favicon assets from the logo icon."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "logo_clean.png"
BRAND_GREEN = (34, 197, 94, 255)  # #22c55e — matches site --green accent
ICON_CROP = (0, 0, 272, 253)


def load_icon() -> Image.Image:
    img = Image.open(SRC).convert("RGBA")
    icon = img.crop(ICON_CROP)

    data = icon.load()
    for y in range(icon.height):
        for x in range(icon.width):
            r, g, b, a = data[x, y]
            if a > 20:
                data[x, y] = BRAND_GREEN

    side = max(icon.width, icon.height)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    offset = ((side - icon.width) // 2, (side - icon.height) // 2)
    square.paste(icon, offset, icon)
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
