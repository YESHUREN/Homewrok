import os

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
files = [f for f in os.listdir(scratch_dir) if f.startswith("notion_page_") and f.endswith(".txt")]

print(f"Found {len(files)} notion page text files:")
for f in sorted(files):
    size = os.path.getsize(os.path.join(scratch_dir, f))
    print(f"  {f} ({size} bytes)")
