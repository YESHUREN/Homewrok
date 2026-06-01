import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for i, line in enumerate(content.splitlines()):
    if 'seed' in line.lower() or 'db' in line.lower() or 'table' in line.lower() or 'init' in line.lower():
        # print safely by encoding/decoding as ascii ignoring errors, or reconfiguring stdout
        print(f"{i+1}: {line.strip()}")
