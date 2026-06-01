import re
import os

ts_file_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_data.ts"
with open(ts_file_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

items = re.findall(r'id:\s*"([a-f0-9]+)",\s*titleZh:\s*"([^"]+)"', ts_content)

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
summary_lines = []

for page_id, name in items:
    txt_path = os.path.join(scratch_dir, f"notion_page_{page_id}.txt")
    if os.path.exists(txt_path):
        with open(txt_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        summary_lines.append(f"PAGE: {name} | {len(lines)} lines")
        if lines:
            summary_lines.append(f"  First lines: {[l.strip() for l in lines[:10] if l.strip()]}")
    else:
        summary_lines.append(f"PAGE: {name} | DOES NOT EXIST")

output_summary = os.path.join(scratch_dir, "fetched_summary.txt")
with open(output_summary, "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(summary_lines))

print(f"Wrote summary of {len(items)} items to {output_summary}")
