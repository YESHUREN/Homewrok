import json

with open("scratch/kcloud_notion_splitbee.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total blocks in Splitbee response: {len(data)}")
for bid, block_data in data.items():
    val = block_data.get("value", {}).get("value", {})
    btype = val.get("type")
    properties = val.get("properties", {})
    content = val.get("content", [])
    
    text = ""
    if properties:
        for k, v in properties.items():
            if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                text = "".join([item[0] for item in v if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                break
                
    print(f"Block {bid}: Type={btype}, ContentLength={len(content)}, Text='{text.strip()}'")
