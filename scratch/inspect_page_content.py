import json
import os

def inspect_content():
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    
    # Let's find a couple of interesting pages
    target_titles = ["开设韩国银行账户\n", "课程注册", "保健室"]
    target_pages = []
    
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        if val.get("type") == "page":
            properties = val.get("properties", {})
            title = ""
            if "title" in properties:
                title = properties["title"][0][0]
            if title in target_titles or any(t.strip() in title for t in target_titles):
                target_pages.append((bid, title, val))
                
    # Helper to recursively get text content of a block and its children
    def get_block_text(block_id, depth=0):
        b = block_map.get(block_id, {})
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            return []
            
        btype = val.get("type")
        properties = val.get("properties", {})
        
        # Extract title or text properties
        text = ""
        if properties:
            for k, v in properties.items():
                if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                    text = v[0][0]
                    break
                    
        res = [{
            "id": block_id,
            "type": btype,
            "text": text,
            "depth": depth,
            "properties": properties
        }]
        
        children = val.get("content", [])
        for cid in children:
            res.extend(get_block_text(cid, depth + 1))
        return res
        
    page_data = {}
    for bid, title, val in target_pages:
        print(f"\nPage: {title} (ID: {bid})")
        children = val.get("content", [])
        print(f"  Has {len(children)} direct children blocks.")
        
        full_content = []
        for cid in children:
            full_content.extend(get_block_text(cid, 0))
            
        page_data[title] = full_content
        
        # Print first 10 items
        for item in full_content[:15]:
            indent = "  " * item["depth"]
            print(f"{indent}- [{item['type']}] {item['text']}")
            
    with open("scratch/sample_pages_content.json", "w", encoding="utf-8") as f:
        json.dump(page_data, f, indent=2, ensure_ascii=False)
    print("\nSaved full sample content to scratch/sample_pages_content.json")

if __name__ == "__main__":
    inspect_content()
