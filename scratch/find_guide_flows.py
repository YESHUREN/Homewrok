import re

def find_guide_flows():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()
        
    lines = content.splitlines()
    print("Lines containing GuideCategory in App.tsx:")
    for idx, line in enumerate(lines, 1):
        if "GuideCategory" in line:
            print(f"  Line {idx}: {line.strip()}")

if __name__ == "__main__":
    find_guide_flows()
