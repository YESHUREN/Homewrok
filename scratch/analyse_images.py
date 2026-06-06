import os
import glob
from datetime import datetime

brain_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"

files = glob.glob(os.path.join(brain_dir, "media__*.png"))
files_with_time = []
for f in files:
    mtime = os.path.getmtime(f)
    size = os.path.getsize(f)
    files_with_time.append((mtime, size, os.path.basename(f)))

# Sort by mtime descending
files_with_time.sort(key=lambda x: x[0], reverse=True)

print("Recent media files in brain directory:")
for mtime, size, name in files_with_time:
    dt = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
    print(f"{name}: Size={size} bytes, Time={dt}")
