import json
import os

def extract_sample():
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    
    count = 0
    samples = []
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
                
            samples.append({
                "id": bid,
                "title": title,
                "properties": properties
            })
            count += 1
            if count >= 10:
                break
                
    with open("scratch/sample_properties.json", "w", encoding="utf-8") as f:
        json.dump(samples, f, indent=2, ensure_ascii=False)
    print("Done. Saved to scratch/sample_properties.json")

if __name__ == "__main__":
    extract_sample()
