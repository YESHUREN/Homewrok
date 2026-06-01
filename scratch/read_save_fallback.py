import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(144, 205):
    print(f"{idx+1}: {lines[idx].rstrip()}")
