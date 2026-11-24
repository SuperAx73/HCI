"""Generates abstract, brand-styled placeholder 'work photo' tiles for each seeded provider.
Not photos of real people/jobs — illustrative mock tiles (gradient + oficio icon), matching the
app's OficioIcon shapes and brand palette, used to fill out provider profile galleries.
"""
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public" / "mock-work"
OUT_DIR.mkdir(parents=True, exist_ok=True)

NAVY = (18, 52, 89)
ORANGE = (239, 139, 45)
SKY = (63, 184, 232)
WHITE = (255, 255, 255)

SIZE = 900

# (providerName, oficio) in the exact order SEEDS appears in seedListings.ts -> folio 1001..1022
PROVIDERS = [
    ("Raúl Chávez", "Electricidad"),
    ("Gabriela Soto", "Electricidad"),
    ("Francisco Null", "Electricidad"),
    ("Luis Armendáriz", "Plomería"),
    ("Patricia Reyes", "Plomería"),
    ("Mario Delgado", "Plomería"),
    ("Daniela Ponce", "Pintura"),
    ("Jorge Baeza", "Pintura"),
    ("Martha Lozoya", "Limpieza"),
    ("Ivonne Carrasco", "Limpieza"),
    ("Esteban Quintana", "Mecánica automotriz"),
    ("Ricardo Molina", "Mecánica automotriz"),
    ("Manuel Terrazas", "Albañilería"),
    ("Sergio Ornelas", "Albañilería"),
    ("Teresa Nevárez", "Jardinería"),
    ("Victor Holguín", "Jardinería"),
    ("Alejandro Prieto", "Carpintería"),
    ("Karla Espino", "Carpintería"),
    ("Oscar Villalobos", "Electrodomésticos"),
    ("Brenda Acosta", "Electrodomésticos"),
    ("Hugo Fierro", "Otro"),
    ("Lorena Batista", "Otro"),
]


def gradient_bg(angle_deg, c1, c2):
    rad = math.radians(angle_deg)
    dx, dy = math.cos(rad), math.sin(rad)
    ys, xs = np.mgrid[0:SIZE, 0:SIZE]
    t = (xs * dx + ys * dy) / (SIZE * (abs(dx) + abs(dy) + 1e-6))
    t = np.clip((t + 1) / 2, 0, 1)[..., None]
    c1a, c2a = np.array(c1, dtype=np.float32), np.array(c2, dtype=np.float32)
    arr = (c1a + (c2a - c1a) * t).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def add_texture(img, rng):
    draw = ImageDraw.Draw(img, "RGBA")
    for _ in range(14):
        r = rng.randint(60, 220)
        x = rng.randint(0, SIZE)
        y = rng.randint(0, SIZE)
        alpha = rng.randint(10, 26)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, alpha))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def icon_bolt(draw, cx, cy, s, color):
    pts = [(cx + 0.15 * s, cy - 0.6 * s), (cx - 0.35 * s, cy + 0.05 * s), (cx - 0.05 * s, cy + 0.05 * s),
           (cx - 0.2 * s, cy + 0.6 * s), (cx + 0.35 * s, cy - 0.1 * s), (cx + 0.05 * s, cy - 0.1 * s)]
    draw.polygon(pts, fill=color)


def icon_drop(draw, cx, cy, s, color):
    draw.pieslice([cx - 0.4 * s, cy - 0.1 * s, cx + 0.4 * s, cy + 0.7 * s], 0, 360, fill=color)
    draw.polygon([(cx, cy - 0.65 * s), (cx - 0.4 * s, cy + 0.05 * s), (cx + 0.4 * s, cy + 0.05 * s)], fill=color)


def icon_roller(draw, cx, cy, s, color):
    draw.rounded_rectangle([cx - 0.5 * s, cy - 0.35 * s, cx + 0.5 * s, cy - 0.05 * s], radius=0.08 * s, fill=color)
    draw.rectangle([cx - 0.04 * s, cy - 0.05 * s, cx + 0.04 * s, cy + 0.25 * s], fill=color)
    draw.rounded_rectangle([cx - 0.14 * s, cy + 0.25 * s, cx + 0.14 * s, cy + 0.55 * s], radius=0.05 * s, fill=color)


def icon_sparkle(draw, cx, cy, s, color):
    draw.ellipse([cx - 0.22 * s, cy - 0.22 * s, cx + 0.22 * s, cy + 0.22 * s], outline=color, width=int(0.06 * s))
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        x1, y1 = cx + 0.32 * s * math.cos(rad), cy + 0.32 * s * math.sin(rad)
        x2, y2 = cx + 0.48 * s * math.cos(rad), cy + 0.48 * s * math.sin(rad)
        draw.line([x1, y1, x2, y2], fill=color, width=int(0.045 * s))


def icon_wrench(draw, cx, cy, s, color):
    draw.line([cx - 0.35 * s, cy + 0.35 * s, cx + 0.3 * s, cy - 0.3 * s], fill=color, width=int(0.14 * s))
    draw.ellipse([cx + 0.12 * s, cy - 0.5 * s, cx + 0.46 * s, cy - 0.16 * s], outline=color, width=int(0.07 * s))
    draw.ellipse([cx - 0.46 * s, cy + 0.16 * s, cx - 0.12 * s, cy + 0.5 * s], fill=color)


def icon_trowel(draw, cx, cy, s, color):
    draw.polygon([(cx - 0.4 * s, cy + 0.45 * s), (cx + 0.1 * s, cy - 0.1 * s), (cx + 0.45 * s, cy - 0.45 * s),
                  (cx + 0.2 * s, cy - 0.5 * s), (cx - 0.15 * s, cy - 0.15 * s), (cx - 0.5 * s, cy + 0.2 * s)], fill=color)


def icon_leaf(draw, cx, cy, s, color):
    draw.pieslice([cx - 0.5 * s, cy - 0.5 * s, cx + 0.5 * s, cy + 0.5 * s], 200, 20, fill=color)
    draw.line([cx - 0.3 * s, cy + 0.3 * s, cx + 0.35 * s, cy - 0.35 * s], fill=NAVY, width=int(0.035 * s))


def icon_hammer(draw, cx, cy, s, color):
    draw.rounded_rectangle([cx - 0.1 * s, cy - 0.1 * s, cx + 0.42 * s, cy + 0.42 * s], radius=0.04 * s, fill=color)
    draw.rounded_rectangle([cx - 0.48 * s, cy - 0.48 * s, cx - 0.04 * s, cy + 0.04 * s], radius=0.06 * s, fill=color)


def icon_plug(draw, cx, cy, s, color):
    draw.rounded_rectangle([cx - 0.3 * s, cy - 0.15 * s, cx + 0.3 * s, cy + 0.3 * s], radius=0.08 * s, fill=color)
    draw.line([cx - 0.12 * s, cy - 0.15 * s, cx - 0.12 * s, cy - 0.4 * s], fill=color, width=int(0.07 * s))
    draw.line([cx + 0.12 * s, cy - 0.15 * s, cx + 0.12 * s, cy - 0.4 * s], fill=color, width=int(0.07 * s))
    draw.line([cx, cy + 0.3 * s, cx, cy + 0.5 * s], fill=color, width=int(0.07 * s))


def icon_tools(draw, cx, cy, s, color):
    draw.line([cx - 0.4 * s, cy + 0.4 * s, cx + 0.3 * s, cy - 0.3 * s], fill=color, width=int(0.1 * s))
    draw.ellipse([cx + 0.15 * s, cy - 0.48 * s, cx + 0.45 * s, cy - 0.18 * s], outline=color, width=int(0.06 * s))
    draw.ellipse([cx - 0.12 * s, cy - 0.12 * s, cx + 0.12 * s, cy + 0.12 * s], fill=color)


ICONS = {
    "Electricidad": icon_bolt,
    "Plomería": icon_drop,
    "Pintura": icon_roller,
    "Limpieza": icon_sparkle,
    "Mecánica automotriz": icon_wrench,
    "Albañilería": icon_trowel,
    "Jardinería": icon_leaf,
    "Carpintería": icon_hammer,
    "Electrodomésticos": icon_plug,
    "Otro": icon_tools,
}

PALETTES = [
    (NAVY, ORANGE),
    (NAVY, SKY),
    (ORANGE, SKY),
]


def make_tile(oficio, seed, angle):
    rng = random.Random(seed)
    c1, c2 = PALETTES[seed % len(PALETTES)]
    img = gradient_bg(angle, c1, c2)
    img = add_texture(img, rng)
    draw = ImageDraw.Draw(img, "RGBA")

    badge_r = SIZE * 0.3
    cx, cy = SIZE / 2, SIZE / 2
    draw.ellipse([cx - badge_r, cy - badge_r, cx + badge_r, cy + badge_r], fill=(255, 255, 255, 235))
    icon_fn = ICONS.get(oficio, icon_tools)
    icon_fn(draw, cx, cy, badge_r * 1.3, NAVY)

    return img.convert("RGB")


def main():
    created = 0
    for i, (name, oficio) in enumerate(PROVIDERS):
        folio = 1001 + i
        for n in range(1, 4):
            seed = folio * 10 + n
            angle = (seed * 37) % 360
            tile = make_tile(oficio, seed, angle)
            path = OUT_DIR / f"{folio}-{n}.jpg"
            tile.save(path, quality=85)
            created += 1
    print(f"Generadas {created} imágenes en {OUT_DIR}")


if __name__ == "__main__":
    main()
