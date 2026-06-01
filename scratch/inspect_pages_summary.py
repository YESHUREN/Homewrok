import os

infra_guides = {
    "图书馆（施工中🔧）": "22439f9906f581a594f4e3f495abd4c5",
    "宿舍": "22439f9906f581389897fc510572de62",
    "学校体育设施": "22439f9906f5813b9623de1a8f6e83fd",
    "保健室": "22439f9906f58160a388f12fab960737",
    "通勤班车运营指南": "22439f9906f581bcaa79dc2ee00e6454",
    "便利设施": "22439f9906f5817db33be7255c840921",
    "Wi-Fi 及 应用程序": "22439f9906f581a2b16ec868a83f7b3d",
    "校园导览图": "22439f9906f581c38390dc0d87bfbeab",
    "住房、自己做饭生活（合租/独居）、搬家": "22439f9906f581bf8d37d5f08185711b",
    "邮政与快递": "22439f9906f581fe8245d7b5b1f4ea24",
    "医疗设施": "22439f9906f581678e3ec69d141cb27b",
    "公共设施": "22439f9906f581ef9d19f31cc0d7c99c",
    "主要购物场所": "22439f9906f5811db761efd199c881b2",
    "三陟旅游景点": "22439f9906f581228bd4ee06f0604a44",
    "三陟餐厅": "22439f9906f580e9387d121d8ff26fc",  # Wait, ID is 22439f9906f5810e9387d121d8ff26fc
    "三陟节庆": "22439f9906f581f6bf2bcc2f2755bf10",
    "如何在三陟租房": "2a439f9906f58131b0c2c10627af353b"
}

# Fix ID for 三陟餐厅
infra_guides["三陟餐厅"] = "22439f9906f5810e9387d121d8ff26fc"

def inspect_all():
    out_lines = []
    for name, page_id in infra_guides.items():
        filepath = f"scratch/notion_page_{page_id}.txt"
        if not os.path.exists(filepath):
            out_lines.append(f"=== {name} ({page_id}) DOES NOT EXIST ===\n")
            continue
            
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        out_lines.append(f"=== {name} ({page_id}) ===")
        out_lines.append(content)
        out_lines.append("=" * 40 + "\n")
        
    with open("scratch/all_infra_pages_summary.txt", "w", encoding="utf-8") as f_out:
        f_out.write("\n".join(out_lines))
    print("Wrote all page details to scratch/all_infra_pages_summary.txt")

if __name__ == "__main__":
    inspect_all()
