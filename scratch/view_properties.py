import json

def view_properties():
    with open("scratch/collection_rows.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    
    pages = []
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        if val.get("type") == "page":
            pages.append(val)
            
    print(f"Total pages: {len(pages)}")
    
    out_lines = []
    for p in pages:
        title = p.get("properties", {}).get("title", [[""]])[0][0]
        out_lines.append(f"Page ID: {p.get('id')}")
        out_lines.append(f"  Title: {title}")
        out_lines.append("  Properties:")
        for k, v in p.get("properties", {}).items():
            if k != "title":
                out_lines.append(f"    - {k}: {v}")
        out_lines.append("")
        
    with open("scratch/page_properties_output.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(out_lines))
    print("Saved page properties to scratch/page_properties_output.txt")

if __name__ == "__main__":
    view_properties()
