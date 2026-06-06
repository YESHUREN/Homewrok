import os
import shutil

src_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"
dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

# The 6 image files from June 1st session
images = [
    ("media__1780314961024.png", "kcloud_update1.png"),
    ("media__1780315094154.png", "kcloud_update2.png"),
    ("media__1780315365799.png", "kcloud_update3.png"),
    ("media__1780315386472.png", "kcloud_update4.png"),
    ("media__1780315509605.png", "kcloud_update5.png"),
    ("media__1780315591825.png", "kcloud_update6.png"),
]

for src_name, dest_name in images:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    shutil.copy(src_path, dest_path)
    print(f"Copied {src_name} to {dest_name}: {os.path.exists(dest_path)}")
