def get_lines():
    with open("src/components/GuideDetail.tsx", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    out = []
    for i in range(1390, 1460):
        if i < len(lines):
            out.append(f"{i+1}: {lines[i]}")
            
    with open("scratch/lines_1400.txt", "w", encoding="utf-8") as f_out:
        f_out.writelines(out)

if __name__ == "__main__":
    get_lines()
