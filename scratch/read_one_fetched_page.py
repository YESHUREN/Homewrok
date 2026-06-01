import os

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"

# Let's inspect 国际化团队介绍 and 学年日程指南
files_to_inspect = [
    "notion_page_22439f9906f581d0b8bed755a0ac04f5.txt", # 国际化团队介绍
    "notion_page_23039f9906f580f59fa0f5a39915fddb.txt", # 学年日程指南
    "notion_page_22439f9906f5813aa3dedbda97cbd28b.txt"  # 学费
]

out_path = os.path.join(scratch_dir, "inspected_samples.txt")
with open(out_path, "w", encoding="utf-8") as f_out:
    for filename in files_to_inspect:
        path = os.path.join(scratch_dir, filename)
        if os.path.exists(path):
            f_out.write(f"\n==================== {filename} ====================\n")
            with open(path, "r", encoding="utf-8") as f:
                f_out.write(f.read())
        else:
            f_out.write(f"\n{filename} DOES NOT EXIST\n")

print("Wrote samples to inspected_samples.txt")
