import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'useState' in line and ('posts' in line or 'profile' in line or 'screen' in line):
        print(f"Line {i+1}: {line.strip()}")
        # Print 5 surrounding lines
        for j in range(max(0, i-2), min(len(lines), i+8)):
            print(f"  {j+1}: {lines[j].rstrip()}")
        print("-" * 40)
