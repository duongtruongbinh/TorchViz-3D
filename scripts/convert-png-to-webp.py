import os
import sys
from pathlib import Path
from PIL import Image

def convert_png_to_webp(root_dir: str):
    root_path = Path(root_dir)
    png_files = sorted(list(root_path.rglob("*.png")))
    print(f"Found {len(png_files)} PNG files in {root_dir}")

    total_png_size = 0
    total_webp_size = 0
    converted = 0
    errors = 0

    for png_path in png_files:
        png_size = png_path.stat().st_size
        total_png_size += png_size
        webp_path = png_path.with_suffix(".webp")

        try:
            with Image.open(png_path) as im:
                # WebP supports RGBA directly, but palette 'P' or 'LA' modes need handling
                if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
                    im_to_save = im.convert("RGBA")
                elif im.mode != "RGB":
                    im_to_save = im.convert("RGB")
                else:
                    im_to_save = im

                im_to_save.save(webp_path, "WEBP", quality=85, method=6)

            # Validate the webp file can be opened and is not 0 bytes
            with Image.open(webp_path) as verify_im:
                verify_im.verify()

            webp_size = webp_path.stat().st_size
            total_webp_size += webp_size
            converted += 1

            # Remove original png
            png_path.unlink()
            print(f"Converted: {png_path.name} ({png_size // 1024}KB -> {webp_size // 1024}KB)")

        except Exception as e:
            print(f"Error converting {png_path}: {e}", file=sys.stderr)
            errors += 1
            if webp_path.exists():
                webp_path.unlink()

    print("\n--- Summary ---")
    print(f"Total files: {len(png_files)}, Converted: {converted}, Errors: {errors}")
    if total_png_size > 0:
        ratio = (1 - total_webp_size / total_png_size) * 100
        print(f"Original size: {total_png_size / (1024 * 1024):.2f} MB")
        print(f"WebP size:     {total_webp_size / (1024 * 1024):.2f} MB")
        print(f"Reduction:     {ratio:.1f}%")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "src/assets/learning"
    convert_png_to_webp(target_dir)
