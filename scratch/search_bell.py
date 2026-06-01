import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

for i, line in enumerate(content.splitlines()):
    if 'Bell' in line:
        print(f"{i+1}: {line.strip()}")
