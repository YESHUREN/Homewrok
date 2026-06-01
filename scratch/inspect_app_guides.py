import re

file_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find occurrences of GuideCategory or how the guide screens are called
matches = []
for idx, line in enumerate(content.split("\n")):
    if "GuideCategory" in line or "GUIDE_DETAIL" in line:
        matches.append(f"Line {idx+1}: {line.strip()}")

output_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch\app_guides_inspect.txt"
with open(output_path, "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(matches))

print(f"Wrote {len(matches)} matches to {output_path}")
