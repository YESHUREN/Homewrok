import os

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
files = [
    "notion_page_22439f9906f5810599d9f1198063f5ac.txt", # 成绩查询与季节学期课程
    "notion_page_22439f9906f58107af1dfa876b27167c.txt", # 兼职工作（打工）
    "notion_page_22439f9906f581dca53ff60a08dd68ae.txt"  # 开设韩国银行账户
]

out_path = os.path.join(scratch_dir, "inspected_samples_2.txt")
with open(out_path, "w", encoding="utf-8") as f_out:
    for filename in files:
        path = os.path.join(scratch_dir, filename)
        if os.path.exists(path):
            f_out.write(f"\n==================== {filename} ====================\n")
            with open(path, "r", encoding="utf-8") as f:
                f_out.write(f.read())
        else:
            f_out.write(f"\n{filename} DOES NOT EXIST\n")

print("Wrote samples to inspected_samples_2.txt")
