import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(643, 715):
    print(f"{j+1}: {lines[j].rstrip()}")
