with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

found = False
for i, line in enumerate(lines):
    if 'INITIAL_POSTS' in line:
        print(f"{i+1}: {line.strip()}")
