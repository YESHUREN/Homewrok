with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines[:35]):
    print(f"{i+1}: {line.rstrip()}")
