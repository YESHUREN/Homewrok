import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx in range(1005, len(lines)):
    print(f"{idx+1}: {lines[idx].rstrip()}")
