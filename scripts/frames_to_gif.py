#!/usr/bin/env python3
"""Crop captured UI frames to 4:3 and write looping GIF + poster JPEG."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FRAMES = ROOT / "app/static/home/frames"
OUT = ROOT / "app/static/home"
SIZE = (960, 720)


def crop_43(image: Image.Image) -> Image.Image:
    width, height = image.size
    target = 4 / 3
    if width / height > target:
        new_w = int(height * target)
        left = 0
        image = image.crop((left, 0, left + new_w, height))
    else:
        new_h = int(width / target)
        image = image.crop((0, 0, width, new_h))
    return image.resize(SIZE, Image.Resampling.LANCZOS)


def to_gif(paths: list[Path], dest: Path, duration_ms: int = 1600) -> None:
    frames = [crop_43(Image.open(path).convert("RGB")) for path in paths if path.exists()]
    if not frames:
        raise SystemExit(f"no frames for {dest.name}")
    poster = dest.with_suffix(".jpg")
    frames[0].save(poster, "JPEG", quality=84, optimize=True)
    quantized = [frame.quantize(colors=96, method=Image.Quantize.MEDIANCUT) for frame in frames]
    quantized[0].save(
        dest,
        save_all=True,
        append_images=quantized[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
    )
    webp = dest.with_suffix(".webp")
    try:
        frames[0].save(webp, "WEBP", quality=82, method=6)
        print(f"wrote {dest} ({dest.stat().st_size // 1024} KB) poster {poster.name} webp {webp.name}")
    except OSError:
        print(f"wrote {dest} ({dest.stat().st_size // 1024} KB) poster {poster.name}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    to_gif(
        [FRAMES / f"calculate-0{i}.png" for i in range(1, 5)],
        OUT / "feature-calculate.gif",
    )
    to_gif(
        [FRAMES / f"disability-0{i}.png" for i in range(1, 4)],
        OUT / "feature-disability.gif",
    )
    to_gif(
        [FRAMES / f"analyze-0{i}.png" for i in range(1, 4)],
        OUT / "feature-analyze.gif",
    )
    to_gif(
        [FRAMES / f"apply-0{i}.png" for i in range(1, 4)],
        OUT / "feature-apply.gif",
    )


if __name__ == "__main__":
    main()
