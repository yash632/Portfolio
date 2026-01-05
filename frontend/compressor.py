import subprocess
import os
import ctypes
from tkinter import Tk, filedialog, messagebox

# ---- DPI FIX (Windows) ----
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    pass

def compress_video_gpu(input_path, output_path, root, cq=19):
    if not os.path.exists(input_path):
        messagebox.showerror("Error", "Input file not found")
        root.quit()
        root.destroy()
        return

    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,

        # GPU encoder (NVENC)
        "-c:v", "h264_nvenc",
        "-preset", "p5",
        "-rc:v", "vbr",
        "-cq:v", str(cq),
        "-b:v", "0",
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",

        "-movflags", "+faststart",

        # audio
        "-c:a", "aac",
        "-b:a", "192k",

        output_path
    ]

    try:
        subprocess.run(command, check=True)
        messagebox.showinfo(
            "Success",
            f"Video compressed successfully!\n\nSaved at:\n{output_path}"
        )
    except subprocess.CalledProcessError:
        messagebox.showerror("Error", "FFmpeg failed to compress the video")
    finally:
        root.quit()
        root.destroy()

def main():
    root = Tk()
    root.withdraw()  # no main window

    # Select input video
    input_video = filedialog.askopenfilename(
        title="Select video to compress",
        filetypes=[("Video Files", "*.mp4 *.mkv *.avi *.mov")]
    )
    if not input_video:
        root.quit()
        root.destroy()
        return

    # Select output file
    output_video = filedialog.asksaveasfilename(
        title="Save compressed video as",
        defaultextension=".mp4",
        filetypes=[("MP4 Video", "*.mp4")]
    )
    if not output_video:
        root.quit()
        root.destroy()
        return

    compress_video_gpu(input_video, output_video, root)

if __name__ == "__main__":
    main()
