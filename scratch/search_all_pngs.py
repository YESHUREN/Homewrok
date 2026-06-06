import os
import glob

brain_root = r"C:\Users\27916\.gemini\antigravity\brain"

# Find all png files recursively under brain_root
png_files = []
for root, dirs, files in os.walk(brain_root):
    for f in files:
        if f.endswith(".png"):
            full_path = os.path.join(root, f)
            size = os.path.getsize(full_path)
            png_files.append((size, full_path))

# Print sorted by path
for size, path in sorted(png_files, key=lambda x: x[1]):
    # Only print path relative to brain_root or basename to save space
    rel_path = os.path.relpath(path, brain_root)
    print(f"{rel_path}: Size={size} bytes")
