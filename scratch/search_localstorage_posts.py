with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.findall(r'localStorage\.[a-zA-Z]+\([^)]*\)', content)
for m in matches:
    if 'post' in m.lower() or 'community' in m.lower():
        print(m)
