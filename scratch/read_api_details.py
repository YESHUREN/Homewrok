import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def print_range(start_idx, num_lines=100):
    for idx in range(start_idx, min(start_idx + num_lines, len(lines))):
        print(f"{idx+1}: {lines[idx].rstrip()}")

print("=== Like API (line 794) ===")
print_range(790, 80)

print("\n=== Comments API (line 910) ===")
print_range(905, 70)
