import os
import shutil

src_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"
dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

# Create public folder if not exist
if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)
    print(f"Created directory: {dest_dir}")

# The map files
# Let's list the media files in src_dir and find the three latest ones
media_files = [f for f in os.listdir(src_dir) if f.startswith("media__") and f.endswith(".png")]
media_files.sort()
print("All media files in brain:", media_files)

# Based on timestamp order:
# media__1780467149360.png (Screenshot)
# media__1780467157386.png (Samcheok map)
# media__1780467170360.png (Dogye map)

file_samcheok = os.path.join(src_dir, "media__1780467157386.png")
file_dogye = os.path.join(src_dir, "media__1780467170360.png")

shutil.copy(file_samcheok, os.path.join(dest_dir, "map_samcheok.png"))
shutil.copy(file_dogye, os.path.join(dest_dir, "map_dogye.png"))

print("Copied files to public/ successfully:")
print("map_samcheok.png exists:", os.path.exists(os.path.join(dest_dir, "map_samcheok.png")))
print("map_dogye.png exists:", os.path.exists(os.path.join(dest_dir, "map_dogye.png")))
