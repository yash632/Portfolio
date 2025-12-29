import os
from PIL import Image

def convert_to_webp(root_dir):
    extensions = ('.jpg', '.jpeg', '.png')
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith(extensions):
                filepath = os.path.join(subdir, file)
                filename = os.path.splitext(file)[0]
                webp_path = os.path.join(subdir, filename + ".webp")
                
                try:
                    with Image.open(filepath) as img:
                        img.save(webp_path, "webp")
                        print(f"Converted: {filepath} -> {webp_path}")
                except Exception as e:
                    print(f"Failed to convert {filepath}: {e}")

if __name__ == "__main__":
    convert_to_webp(r"d:\Development\MyPortfolio\frontend\public")
