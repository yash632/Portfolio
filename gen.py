# from huggingface_hub import InferenceClient
# from PIL import Image
# import os

# # =============================
# # CONFIG
# # =============================
# HF_TOKEN = "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"

# OUTPUT_DIR = "./neural_cyber_icons"
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# client = InferenceClient(
#     model="stabilityai/stable-diffusion-xl-base-1.0",
#     token=HF_TOKEN
# )

# ICON_WORDS = [
#     "Neural Core","AI Brain","Neural Matrix","Neural Grid","Synaptic Network",
#     "Cognitive Field","Intelligence Core","Mind Mesh","Digital Cortex","Synthetic Brain",
#     "Neural Links","Synapse Flow","Data Nodes","Connection Graph","Signal Paths",
#     "Network Topology","Information Flow","Node Cluster","Dynamic Links","Intelligence Web",
#     "Data Stream","Energy Pulse","Signal Wave","Quantum Flow","Pulse Field",
#     "Flux Motion","Dynamic Energy","Wave propagation","Digital Pulse","Neural Activity",
#     "Cyber Space","Digital Realm","Virtual Intelligence","Tech Grid","Future Interface",
#     "AI Dimension","System Core","Virtual Neural Space","Machine Consciousness","Synthetic Reality"
# ]

# # =============================
# # PROMPT TEMPLATE (VERY IMPORTANT)
# # =============================
# BASE_PROMPT = """
# Ultra-detailed futuristic cyber-neural visualization of {concept},
# glowing cyan and magenta neon neural pathways,
# intricate wireframe brain structure,
# high-contrast dark black background,
# clean sharp lines, symmetrical composition,
# digital sci-fi aesthetic, holographic glow,
# cinematic lighting, premium AI visualization,
# no text, no watermark, no background clutter
# """

# NEGATIVE_PROMPT = """
# cartoon, flat icon, low quality, blurry, noisy, oversaturated,
# text, watermark, logo, letters, symbols,
# ugly, distorted, random shapes, background scenery,
# photograph, realistic human, skin, face
# """

# # =============================
# # GENERATE IMAGES
# # =============================
# for i, word in enumerate(ICON_WORDS, start=1):
#     print(f"⏳ Generating {i}/{len(ICON_WORDS)} → {word}")

#     prompt = BASE_PROMPT.format(concept=word)

#     image = client.text_to_image(
#         prompt,
#         negative_prompt=NEGATIVE_PROMPT,
#         width=1024,
#         height=1024,
#         guidance_scale=8.5,        # 🔥 very important
#         num_inference_steps=35     # 🔥 clean details
#     )

#     filename = f"{i:02d}_{word.replace(' ', '_').lower()}.png"
#     image.save(os.path.join(OUTPUT_DIR, filename))

#     print(f"✅ Saved: {filename}")

# print("\n🔥 ALL CYBER-NEURAL IMAGES GENERATED SUCCESSFULLY")




import os

FOLDER_PATH = r"D:\Development\MyPortfolio\frontend\public\final_icons"
WEB_PREFIX = "/final_icons"

files = sorted(
    f for f in os.listdir(FOLDER_PATH)
    if f.lower().endswith((".png", ".jpg", ".jpeg", ".svg"))
)

js_array = "[\n" + ",\n".join(
    f'  "{WEB_PREFIX}/{file}"' for file in files
) + "\n];"

print(js_array)
