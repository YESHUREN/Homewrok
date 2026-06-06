import os
import shutil

src_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"
dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

# The correct 6 image files from June 1st session
images = [
    ("media__1780324314682.png", "kcloud_update1.png"),
    ("media__1780326054727.png", "kcloud_update2.png"),
    ("media__1780326212462.png", "kcloud_update3.png"),
    ("media__1780326484959.png", "kcloud_update4.png"),
    ("media__1780326496779.png", "kcloud_update5.png"),
    ("media__1780327146076.png", "kcloud_update6.png"),
]

print("Copying correct K-Cloud update images...")
for src_name, dest_name in images:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Successfully copied {src_name} to {dest_name} (Size={os.path.getsize(dest_path)} bytes)")
    else:
        print(f"Error: source file {src_name} does not exist!")
