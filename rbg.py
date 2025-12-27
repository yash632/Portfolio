from rembg import remove
from PIL import Image
import os

INPUT_DIR = "./signature"
OUTPUT_DIR = "./clean_png"
os.makedirs(OUTPUT_DIR, exist_ok=True)

for file in os.listdir(INPUT_DIR):
    if file.lower().endswith((".png", ".jpg", ".jpeg")):
        inp = Image.open(os.path.join(INPUT_DIR, file))
        out = remove(inp)
        out.save(os.path.join(OUTPUT_DIR, file.replace(".jpg", ".png")))
        print("✅ BG removed:", file)


# import cv2
# import numpy as np
# import os

# INPUT_DIR = "./clean_png"
# OUTPUT_DIR = "./final_icons"
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # Sharpen kernel (safe & correct)
# kernel = np.array([
#     [0, -1,  0],
#     [-1, 5, -1],
#     [0, -1,  0]
# ], dtype=np.float32)

# for file in os.listdir(INPUT_DIR):
#     if file.lower().endswith(".png"):
#         img = cv2.imread(os.path.join(INPUT_DIR, file), cv2.IMREAD_UNCHANGED)

#         if img is None:
#             continue

#         sharp = cv2.filter2D(img, -1, kernel)
#         cv2.imwrite(os.path.join(OUTPUT_DIR, file), sharp)

#         print("✨ Sharpened:", file)

# print("✅ All images sharpened successfully")
