with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'useState' in line and ('post' in line.lower() or 'community' in line.lower()):
        print(f"{i+1}: {line.strip()}")
