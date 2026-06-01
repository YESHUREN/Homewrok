import os

search_dir = r'c:\Users\27916\Downloads\在韩留学生服务社区'
target_id = "550e8400-e29b-41d4-a716-446655440001"

for root, dirs, files in os.walk(search_dir):
    if '.git' in root or 'node_modules' in root or '.system_generated' in root or 'scratch' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.js', '.jsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if target_id in content:
                        print(f"Found in {filepath}")
            except Exception as e:
                pass
