import json
import os

source_file = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch\notion_result.json"

with open(source_file, "r", encoding="utf-8") as f:
    data = json.load(f)

print("Keys in notion_result.json:")
print(list(data.keys()))

record_map = data.get("recordMap", {})
print("\nKeys in recordMap:")
print(list(record_map.keys()))

if "block" in record_map:
    block_map = record_map["block"]
    print(f"\nNumber of blocks: {len(block_map)}")
    
    # Print some block IDs and their types
    print("\nSample block IDs and their types:")
    sample_ids = list(block_map.keys())[:10]
    for bid in sample_ids:
        val = block_map[bid].get("value", {})
        if "value" in val:
            val = val["value"]
        print(f"  ID: {bid} | Type: {val.get('type')} | Parent ID: {val.get('parent_id')} | Parent Table: {val.get('parent_table')}")
        if val.get("type") == "page":
            print(f"    Page properties: {list(val.get('properties', {}).keys())}")
            title_list = val.get("properties", {}).get("title", [])
            print(f"    Title list: {title_list}")
else:
    print("\n'block' not found in recordMap")
