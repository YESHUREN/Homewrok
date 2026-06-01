def find_lines():
    with open("src/i18n.ts", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    out = []
    for idx, line in enumerate(lines, 1):
        if "guide_shipping" in line:
            out.append(f"Line {idx}: {line.strip()}\n")
            
    with open("scratch/i18n_shipping_lines.txt", "w", encoding="utf-8") as f_out:
        f_out.writelines(out)

if __name__ == "__main__":
    find_lines()
