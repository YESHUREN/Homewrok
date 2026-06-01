import json
import os

def diagnose():
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    collection_map = record_map.get("collection", {})
    
    print(f"Total blocks: {len(block_map)}")
    print(f"Total collections: {len(collection_map)}")
    
    # Let's count by block type and parent table
    stats = {}
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        btype = val.get("type")
        ptable = val.get("parent_table")
        pid = val.get("parent_id")
        
        key = (btype, ptable)
        stats[key] = stats.get(key, 0) + 1
        
    print("\nBlock statistics (Type, Parent Table) -> Count:")
    for k, v in stats.items():
        print(f"  {k} -> {v}")
        
    # Let's write out some details of blocks of type 'page' to diagnose
    page_details = []
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        btype = val.get("type")
        if btype == "page":
            ptable = val.get("parent_table")
            pid = val.get("parent_id")
            properties = val.get("properties", {})
            title = ""
            if properties and "title" in properties:
                t_prop = properties["title"]
                if isinstance(t_prop, list) and len(t_prop) > 0 and isinstance(t_prop[0], list):
                    title = t_prop[0][0]
            
            page_details.append({
                "id": bid,
                "parent_table": ptable,
                "parent_id": pid,
                "title": title,
                "properties_keys": list(properties.keys()) if properties else []
            })
            
    print(f"\nTotal page blocks found: {len(page_details)}")
    with open("scratch/diagnose_pages.json", "w", encoding="utf-8") as f:
        json.dump(page_details, f, indent=2, ensure_ascii=False)
    print("Saved page details to scratch/diagnose_pages.json")

if __name__ == "__main__":
    diagnose()
