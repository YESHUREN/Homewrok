import json

def find_ids():
    with open("scratch/notion_result.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    
    # Check collections
    collections = record_map.get("collection", {})
    print("--- Collections ---")
    for cid, col in collections.items():
        val = col.get("value", {})
        print(f"Collection ID: {cid}")
        print(f"  Parent ID: {val.get('parent_id')}")
        print(f"  Space ID: {val.get('space_id')}")
        print(f"  Name: {val.get('name')}")
        
    # Check collection views
    collection_views = record_map.get("collection_view", {})
    print("\n--- Collection Views ---")
    for cvid, cv in collection_views.items():
        val = cv.get("value", {})
        print(f"View ID: {cvid}")
        print(f"  Type: {val.get('type')}")
        print(f"  Space ID: {val.get('space_id')}")
        
    # Check blocks
    blocks = record_map.get("block", {})
    print("\n--- Page Blocks ---")
    for bid, block in blocks.items():
        val = block.get("value", {})
        btype = val.get("type")
        if btype in ["page", "collection_view", "collection_view_page"]:
            print(f"Block ID: {bid}")
            print(f"  Type: {btype}")
            print(f"  Space ID: {val.get('space_id')}")
            print(f"  Properties: {val.get('properties')}")

if __name__ == "__main__":
    find_ids()
