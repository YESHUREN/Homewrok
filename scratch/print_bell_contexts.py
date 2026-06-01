import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

line_indices = [1547, 1717, 2263, 2430, 2732]
for idx in line_indices:
    print(f"--- Context for line {idx} ---")
    start = max(0, idx - 10)
    end = min(len(lines), idx + 10)
    for j in range(start, end):
        print(f"{j+1}: {lines[j].strip()}")
