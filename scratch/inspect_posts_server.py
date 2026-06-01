import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'app.post("/api/posts"' in line:
        print(f"Found on line {i+1}: {line.strip()}")
        for idx in range(i-2, i+60):
            if idx < len(lines):
                print(f"  {idx+1}: {lines[idx].rstrip()}")
        break
