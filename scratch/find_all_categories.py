import json
import os

def find_categories():
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    
    pages = []
    categories = set()
    
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        btype = val.get("type")
        if btype == "page":
            properties = val.get("properties", {})
            title = ""
            if "title" in properties:
                title = properties["title"][0][0]
            
            cat = ""
            if "^LRo" in properties:
                cat = properties["^LRo"][0][0]
                categories.add(cat)
                
            pages.append({
                "id": bid.replace("-", ""),
                "title": title.strip(),
                "category": cat.strip()
            })
            
    # Removed prints to avoid GBK encoding errors
    pass
    
    # Let's write the organized list to a JSON file
    with open("scratch/knu_pages_list.json", "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)
    print("Saved pages list to scratch/knu_pages_list.json")

if __name__ == "__main__":
    find_categories()
