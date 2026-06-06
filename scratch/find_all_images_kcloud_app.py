import json
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open("scratch/kcloud_app_splitbee.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Listing all image blocks in kcloud_app_splitbee.json:")
count = 0
for bid, block_data in data.items():
    val = block_data.get("value", {}).get("value", {})
    if val.get("type") == "image":
        count += 1
        properties = val.get("properties", {})
        title = properties.get("title", [[""]])[0][0]
        size = properties.get("size", [[""]])[0][0]
        source = properties.get("source", [[""]])[0][0]
        print(f"Image {count}:")
        print(f"  Block ID: {bid}")
        print(f"  Title: {title}")
        print(f"  Size: {size}")
        print(f"  Source: {source}")
        print("-" * 50)
        
print(f"Total image blocks: {count}")
