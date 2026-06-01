import json

def scan():
    with open("scratch/collection_rows.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"Top-level keys: {list(data.keys())}")
    
    record_map = data.get("recordMap", {})
    print(f"recordMap keys: {list(record_map.keys())}")
    
    for key in ["block", "collection", "collection_view"]:
        m = record_map.get(key, {})
        print(f"  {key} keys: {list(m.keys())}")
        
    block_map = record_map.get("block", {})
    print("\n--- SAMPLE BLOCKS FROM collection_rows.json ---")
    count = 0
    for bid, b in block_map.items():
        print(f"Block ID: {bid}")
        if isinstance(b, dict):
            # Try to get nested block value
            val = b.get("value", {})
            if isinstance(val, dict) and "value" in val:
                actual_block = val["value"]
            else:
                actual_block = val
            
            if isinstance(actual_block, dict):
                print(f"    Type: {actual_block.get('type')}")
                print(f"    Parent: {actual_block.get('parent_table')} / {actual_block.get('parent_id')}")
                properties = actual_block.get('properties', {})
                print(f"    Properties keys: {list(properties.keys()) if properties else 'None'}")
                if properties:
                    for prop_name, prop_val in properties.items():
                        print(f"      {prop_name}: {prop_val}")
            else:
                print("    Actual block is not a dict")
        count += 1
        if count >= 5:
            break

    # Also inspect notion_result.json if it exists
    try:
        with open("scratch/notion_result.json", "r", encoding="utf-8") as f:
            res_data = json.load(f)
        res_record_map = res_data.get("recordMap", {})
        res_block_map = res_record_map.get("block", {})
        print("\n--- SAMPLE BLOCKS FROM notion_result.json ---")
        count = 0
        for bid, b in res_block_map.items():
            print(f"Block ID: {bid}")
            if isinstance(b, dict):
                val = b.get("value", {})
                if isinstance(val, dict) and "value" in val:
                    actual_block = val["value"]
                else:
                    actual_block = val
                
                if isinstance(actual_block, dict):
                    print(f"    Type: {actual_block.get('type')}")
                    print(f"    Parent: {actual_block.get('parent_table')} / {actual_block.get('parent_id')}")
                    properties = actual_block.get('properties', {})
                    print(f"    Properties keys: {list(properties.keys()) if properties else 'None'}")
            count += 1
            if count >= 3:
                break
    except Exception as e:
        print(f"Error loading notion_result.json: {e}")

if __name__ == "__main__":
    scan()
