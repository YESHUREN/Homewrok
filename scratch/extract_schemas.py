import json
import os

def extract_schemas():
    source_file = "scratch/notion_result.json"
    if not os.path.exists(source_file):
        source_file = "scratch/collection_rows.json"
        
    with open(source_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    record_map = data.get("recordMap", {})
    collection_map = record_map.get("collection", {})
    
    col_schemas = {}
    for cid, col in collection_map.items():
        val = col.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            continue
            
        col_name_prop = val.get("name", [[""]])
        col_name = "".join([t[0] for t in col_name_prop if isinstance(t, list) and len(t) > 0])
        
        schema = val.get("schema", {})
        schema_info = {}
        for prop_id, prop_val in schema.items():
            schema_info[prop_id] = {
                "name": prop_val.get("name"),
                "type": prop_val.get("type"),
                "options": prop_val.get("options", [])
            }
        col_schemas[cid] = {
            "name": col_name,
            "schema": schema_info
        }
        
    with open("scratch/schemas_info.json", "w", encoding="utf-8") as f:
        json.dump(col_schemas, f, indent=2, ensure_ascii=False)
    print("Done. Saved schemas info.")

if __name__ == "__main__":
    extract_schemas()
