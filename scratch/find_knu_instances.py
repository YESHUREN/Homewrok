def find_knu():
    with open("src/components/GuideDetail.tsx", "r", encoding="utf-8") as f:
        content = f.read()
        
    lines = content.splitlines()
    for idx, line in enumerate(lines, 1):
        if "GuideCategory.KNU" in line:
            print(f"Line {idx}: {line.strip()}")
            
    print(f"\nTotal lines in GuideDetail.tsx: {len(lines)}")

if __name__ == "__main__":
    find_knu()
