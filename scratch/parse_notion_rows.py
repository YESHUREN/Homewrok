import json
import os

def parse_notion_data():
    # We can try reading scratch/notion_result.json first, and fallback to scratch/collection_rows.json if needed
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    print(f"Reading from {source_file}...")
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    block_map = record_map.get("block", {})
    collection_map = record_map.get("collection", {})
    
    # 1. Parse schemas from all collections
    schemas = {}
    for cid, col in collection_map.items():
        val = col.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        col_name_prop = val.get("name", [[""]])
        col_name = "".join([t[0] for t in col_name_prop if isinstance(t, list) and len(t) > 0])
        # Removed prints to avoid Windows console GBK encoding issues
        
        schema = val.get("schema", {})
        schemas[cid] = schema
            
    # 2. Extract database rows
    parsed_rows = []
    
    for bid, block in block_map.items():
        val = block.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        btype = val.get("type")
        parent_table = val.get("parent_table")
        parent_id = val.get("parent_id")
        
        # In Notion, a row in a collection is a page block whose parent_table is "collection"
        # Or, sometimes it's a page and its parent_id matches one of our collection IDs
        is_row = (btype == "page" and parent_table == "collection") or (btype == "page" and parent_id in schemas)
        
        if is_row:
            properties = val.get("properties", {})
            if not properties:
                continue
                
            row_data = {
                "id": bid,
                "parent_id": parent_id,
                "properties_raw": {}
            }
            
            # Helper to extract clean text from Notion property list structure
            def extract_text(prop_list):
                if not prop_list or not isinstance(prop_list, list):
                    return ""
                texts = []
                for item in prop_list:
                    if isinstance(item, list) and len(item) > 0:
                        val_str = item[0]
                        # Sometimes Notion represents tags as tag strings or URLs
                        if isinstance(val_str, str):
                            texts.append(val_str)
                return "".join(texts)
                
            # Extract standard title
            title_list = properties.get("title", [])
            row_data["title"] = extract_text(title_list)
            
            # Look up schema properties
            schema = schemas.get(parent_id, {})
            for prop_id, prop_val in schema.items():
                prop_name = prop_val.get("name")
                prop_type = prop_val.get("type")
                if prop_id in properties:
                    prop_data = properties[prop_id]
                    # Format value based on property type
                    cleaned_val = ""
                    if prop_type in ["multi_select", "select"]:
                        # e.g., [['tag1,tag2', [['v', ...]]]]
                        cleaned_val = extract_text(prop_data)
                    elif prop_type == "url":
                        cleaned_val = extract_text(prop_data)
                    elif prop_type == "text":
                        cleaned_val = extract_text(prop_data)
                    else:
                        cleaned_val = extract_text(prop_data)
                        
                    row_data[prop_name] = cleaned_val
                    row_data["properties_raw"][prop_name] = {
                        "type": prop_type,
                        "raw": prop_data,
                        "value": cleaned_val
                    }
                    
            parsed_rows.append(row_data)
            
    print(f"\nSuccessfully parsed {len(parsed_rows)} rows.")
    
    # Write to a JSON file
    out_file = "scratch/parsed_collection_rows.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(parsed_rows, f, indent=2, ensure_ascii=False)
        
    print(f"Saved parsed rows to {out_file}")

if __name__ == "__main__":
    parse_notion_data()
