import os
import shutil

src_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"
dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

# The 4 step image files uploaded at 15:55:42
images = [
    ("media__1780469648807.png", "eruri_step1.png"),
    ("media__1780469656639.png", "eruri_step2.png"),
    ("media__1780469666963.png", "eruri_step3.png"),
    ("media__1780469674409.png", "eruri_step4.png"),
]

print("Copying correct e-RURI step images...")
for src_name, dest_name in images:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Successfully copied {src_name} to {dest_name} (Size={os.path.getsize(dest_path)} bytes)")
    else:
        print(f"Error: source file {src_name} does not exist!")
