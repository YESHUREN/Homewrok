import json

def scan_json():
    with open("scratch/notion_result.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    def find_key(obj, target_key):
        results = []
        if isinstance(obj, dict):
            for k, v in obj.items():
                if k == target_key:
                    results.append(v)
                results.extend(find_key(v, target_key))
        elif isinstance(obj, list):
            for item in obj:
                results.extend(find_key(item, target_key))
        return results

    space_ids = find_key(data, "space_id")
    print(f"space_id matches: {list(set(space_ids))}")
    
    collection_ids = find_key(data, "collection_id")
    print(f"collection_id matches: {list(set(collection_ids))}")
    
    # Let's inspect block value map to see keys and values
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    for bid, block in block_map.items():
        val = block.get("value", {})
        if "space_id" in val:
            print(f"Found space_id in block {bid}: {val['space_id']}")
            break

if __name__ == "__main__":
    scan_json()
