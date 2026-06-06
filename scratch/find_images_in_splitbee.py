import json

with open("scratch/kcloud_notion_splitbee.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for bid, block_data in data.items():
    val = block_data.get("value", {}).get("value", {})
    if val.get("type") == "image":
        print(f"Block ID: {bid}")
        print(json.dumps(val, indent=2, ensure_ascii=False))
        print("-" * 60)
