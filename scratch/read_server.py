import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find app.get or app.post routes
import re
routes = re.findall(r'app\.(get|post|put|delete)\([^)]+\)', content)
print("Routes found:")
for r in routes:
    print(r)

print("\n--- Let's search for '/api/' routing definitions ---")
lines = content.split('\n')
for i, line in enumerate(lines):
    if '/api/' in line:
        print(f"Line {i+1}: {line.strip()}")
