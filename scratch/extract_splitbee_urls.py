import json

with open("scratch/kcloud_notion_splitbee.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for bid, block_data in data.items():
    val = block_data.get("value", {}).get("value", {})
    btype = val.get("type")
    if btype == "image":
        print(f"Block: {bid}")
        properties = val.get("properties", {})
        source_val = properties.get("source", [])
        print(f"  source property: {source_val}")
        format_info = val.get("format", {})
        display_source = format_info.get("display_source", "")
        print(f"  display_source: {display_source}")
        print("-" * 60)
