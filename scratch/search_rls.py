with open(r'c:\Users\27916\Downloads\在韩留学生服务社区\supabase_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

for i, line in enumerate(content.splitlines()):
    if 'security' in line.lower() or 'policy' in line.lower() or 'enable' in line.lower():
        print(f"{i+1}: {line.strip()}")
