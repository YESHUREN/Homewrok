import os

brain_root = r"C:\Users\27916\.gemini\antigravity\brain"

for item in os.listdir(brain_root):
    full = os.path.join(brain_root, item)
    if os.path.isdir(full):
        # count all files recursively
        count = 0
        extensions = set()
        for r, ds, fs in os.walk(full):
            count += len(fs)
            for f in fs:
                extensions.add(os.path.splitext(f)[1].lower())
        print(f"Directory: {item} - Total files recursively: {count}, Exts: {list(extensions)[:10]}")
