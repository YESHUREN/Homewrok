import os

search_dir = r'c:\Users\27916\Downloads\在韩留学生服务社区'

for root, dirs, files in os.walk(search_dir):
    if 'node_modules' in root or '.git' in root or 'scratch' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.js', '.jsx', '.env', '.example')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'service' in content.lower() and 'role' in content.lower():
                        print(f"Found in {filepath}")
            except Exception as e:
                pass
