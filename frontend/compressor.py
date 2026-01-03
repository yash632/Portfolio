import subprocess
import os
import sys

def compress_video_gpu(input_path, output_path, cq=19):
    """
    GPU (NVENC) based video compression
    cq = 18–20 (lower = better quality)
    """

    if not os.path.exists(input_path):
        print("❌ Input file not found")
        return

    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,

        # 🔥 GPU encoder
        "-c:v", "h264_nvenc",
        "-preset", "p5",        # balance speed + quality
        "-rc:v", "vbr",
        "-cq:v", str(cq),
        "-b:v", "0",
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",

        # fast streaming
        "-movflags", "+faststart",

        # audio
        "-c:a", "aac",
        "-b:a", "192k",

        output_path
    ]

    print("🚀 Compressing video using GPU...")
    subprocess.run(command, check=True)
    print("✅ Done!")
    print("📁 Output:", output_path)

if __name__ == "__main__":
    input_video = r"C:\Users\HP\OneDrive\Videos\Screen Recordings\Screen Recording 2026-01-03 190104.mp4"
    output_video = r"C:\Users\HP\OneDrive\Videos\Screen Recordings\HennaBliss.mp4"

    compress_video_gpu(input_video, output_video)
