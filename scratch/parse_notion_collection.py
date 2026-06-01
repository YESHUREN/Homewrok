import json

def parse_collection():
    try:
        with open("scratch/notion_result.json", "r", encoding="utf-8") as f:
            res_json = json.load(f)
            
        record_map = res_json.get("recordMap", {})
        block_map = record_map.get("block", {})
        collection_map = record_map.get("collection", {})
        collection_view_map = record_map.get("collection_view", {})
        
        print(f"Collections: {len(collection_map)}")
        print(f"Collection Views: {len(collection_view_map)}")
        
        # 1. Print Collection Schemas
        schemas = {}
        for cid, col in collection_map.items():
            val = col.get("value", {})
            name = "".join([t[0] for t in val.get("name", [[""]]) if isinstance(t, list) and len(t) > 0])
            print(f"\nCollection Name: {name} ({cid})")
            schema = val.get("schema", {})
            schemas[cid] = schema
            for key, prop in schema.items():
                print(f"  Schema Prop: {key} -> {prop.get('name')} ({prop.get('type')})")
                
        # 2. Print Page Blocks (which represent rows in a database view)
        print("\n--- DATABASE ROWS ---")
        rows = []
        for bid, block in block_map.items():
            val = block.get("value", {})
            btype = val.get("type")
            parent_table = val.get("parent_table")
            
            # Rows in a database are pages whose parent is a collection
            if btype == "page" and parent_table == "collection":
                properties = val.get("properties", {})
                row_data = {}
                row_data["id"] = bid
                
                # Extract title
                title_prop = properties.get("title", [[""]])
                title_text = "".join([t[0] for t in title_prop if isinstance(t, list) and len(t) > 0])
                row_data["Title"] = title_text
                
                # Match other properties based on schema
                parent_id = val.get("parent_id")
                schema = schemas.get(parent_id, {})
                
                for schema_key, schema_val in schema.items():
                    prop_name = schema_val.get("name")
                    prop_type = schema_val.get("type")
                    prop_data = properties.get(schema_key, [[""]])
                    
                    # Convert prop_data to string text
                    prop_text = ""
                    if prop_data:
                        # Handle multi-select tags, files, dates, texts
                        texts = []
                        for item in prop_data:
                            if isinstance(item, list) and len(item) > 0:
                                texts.append(item[0])
                        prop_text = "".join(texts)
                        
                    row_data[prop_name] = prop_text
                    
                rows.append(row_data)
                
        print(f"Total Rows: {len(rows)}")
        for i, r in enumerate(rows, 1):
            print(f"\n[Row {i}]")
            for k, v in r.items():
                if k != "id" and v.strip():
                    print(f"  {k}: {v}")
                    
        # Write parsed rows to a file
        with open("scratch/notion_rows.json", "w", encoding="utf-8") as f:
            json.dump(rows, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        print(f"Error parsing collection: {e}")

if __name__ == "__main__":
    parse_collection()
