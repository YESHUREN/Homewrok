import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find fetch calls
fetches = re.findall(r'fetch\([^)]+\)', content)
print("Fetch calls found in App.tsx:")
for fetch in fetches[:30]:
    print(fetch)
