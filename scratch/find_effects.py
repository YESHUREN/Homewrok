with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'useEffect(' in line:
        print(f"Line {i+1}: {line.strip()}")
        # print 5 lines
        for j in range(max(0, i-2), min(len(lines), i+6)):
            print(f"  {j+1}: {lines[j].rstrip()}")
        print("-" * 40)
