import json

with open("scratch/notion_result.json", "r", encoding="utf-8") as f:
    data = json.load(f)

block_map = data.get("recordMap", {}).get("block", {})
print(f"Total blocks in local file: {len(block_map)}")

target_id = "22439f99-06f5-81c3-8390-dc0d87bfbeab"
child_blocks = []
for bid, block in block_map.items():
    val = block.get("value", {}).get("value", {})
    parent_id = val.get("parent_id")
    if parent_id == target_id:
        child_blocks.append((bid, val))

print(f"Found {len(child_blocks)} direct child blocks for {target_id}:")
for bid, val in child_blocks:
    print(f"  Block: {bid} | Type: {val.get('type')} | Content: {val.get('content')}")

# Also check the specific content IDs referenced by target page:
referenced_ids = [
    "22439f99-06f5-814a-86f1-c9b76af2e1d4",
    "22439f99-06f5-81c7-b5b3-c235426b478c",
    "22439f99-06f5-818b-b7db-db4266c95cb3",
    "22439f99-06f5-816b-9853-e14a8f559232"
]
for ref_id in referenced_ids:
    block = block_map.get(ref_id)
    if block:
        val = block.get("value", {}).get("value", {})
        print(f"Referenced block: {ref_id} | Type: {val.get('type')} | Content count: {len(val.get('content', []))}")
        # Print child content blocks
        for child_id in val.get('content', []):
            child_block = block_map.get(child_id)
            if child_block:
                cv = child_block.get("value", {}).get("value", {})
                print(f"    Child: {child_id} | Type: {cv.get('type')} | Properties: {cv.get('properties')}")
    else:
        print(f"Referenced block {ref_id} NOT found in block_map")
