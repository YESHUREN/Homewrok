import sys
import io

# Force stdout to use utf-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Bell' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print 5 lines before and after
        start = max(0, i-5)
        end = min(len(lines), i+6)
        for j in range(start, end):
            prefix = "=>" if j == i else "  "
            print(f"  {prefix} {j+1}: {lines[j].rstrip()}")
        print("-" * 40)
