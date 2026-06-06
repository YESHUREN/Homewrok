import json

with open("scratch/kcloud_notion_public_raw.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Top-level keys in kcloud_notion_public_raw.json: {list(data.keys())}")
if "recordMap" in data:
    record_map = data["recordMap"]
    print(f"recordMap keys: {list(record_map.keys())}")
    for k in record_map:
        print(f"  {k}: {len(record_map[k])} items")
else:
    print("No recordMap found!")
