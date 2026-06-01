def print_lines():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    out_lines = []
    for i in range(2540, 2640):
        if i < len(lines):
            out_lines.append(f"{i+1}: {lines[i]}")
            
    with open("scratch/guide_list_output.txt", "w", encoding="utf-8") as f_out:
        f_out.writelines(out_lines)

if __name__ == "__main__":
    print_lines()
