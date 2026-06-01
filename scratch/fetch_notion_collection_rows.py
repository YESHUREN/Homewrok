import urllib.request
import json

def fetch_notion_collection():
    url = "https://www.notion.so/api/v3/queryCollection"
    
    # Correct space ID and collection details
    space_id = "db713885-d348-4029-9b04-7f3d52d07387"
    collection_id = "22439f99-06f5-81bf-ab98-000bda27f933"
    collection_view_id = "22439f99-06f5-81f5-ab9e-000cf713c1f0"
    
    payload = {
        "collection": {
            "id": collection_id,
            "spaceId": space_id
        },
        "collectionView": {
            "id": collection_view_id,
            "spaceId": space_id
        },
        "loader": {
            "type": "reducer",
            "reducers": {
                "collection_groupresults": {
                    "type": "results",
                    "limit": 100
                }
            },
            "searchQuery": "",
            "userTimeZone": "Asia/Seoul"
        }
    }
    
    req_body = json.dumps(payload).encode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    req = urllib.request.Request(url, data=req_body, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            res_json = json.loads(res_data)
            
            with open("scratch/collection_rows.json", "w", encoding="utf-8") as f:
                json.dump(res_json, f, indent=2, ensure_ascii=False)
                
            print("Successfully saved collection query result to scratch/collection_rows.json")
            
            # Print page rows!
            record_map = res_json.get("recordMap", {})
            block_map = record_map.get("block", {})
            collection_map = record_map.get("collection", {})
            
            # Extract schemas to map column keys to real property names!
            schema = {}
            for cid, col in collection_map.items():
                if cid == collection_id:
                    schema = col.get("value", {}).get("schema", {})
                    break
            
            print(f"\nBlocks in recordMap: {len(block_map)}")
            print(f"Collection Schema Properties: {len(schema)}")
            
            rows_found = 0
            rows_data = []
            
            for bid, block in block_map.items():
                val = block.get("value", {})
                btype = val.get("type")
                parent_table = val.get("parent_table")
                
                # Check if it is a database page row
                if btype == "page" and parent_table == "collection":
                    properties = val.get("properties", {})
                    
                    row_info = {}
                    row_info["id"] = bid
                    
                    # Extract title
                    title_prop = properties.get("title", [[""]])
                    title = "".join([t[0] for t in title_prop if isinstance(t, list) and len(t) > 0])
                    row_info["Title"] = title
                    
                    # Match other properties based on schema mapping
                    for prop_id, prop_val in properties.items():
                        if prop_id != "title" and prop_id in schema:
                            col_name = schema[prop_id].get("name")
                            prop_text = "".join([item[0] for item in prop_val if isinstance(item, list) and len(item) > 0])
                            row_info[col_name] = prop_text
                            
                    rows_data.append(row_info)
                    rows_found += 1
            
            print(f"\nTotal Database Rows Fetched: {rows_found}")
            for i, r in enumerate(rows_data, 1):
                print(f"\n[Item {i}]")
                for k, v in r.items():
                    if k != "id" and v.strip():
                        print(f"  {k}: {v}")
                        
            with open("scratch/parsed_collection_rows.json", "w", encoding="utf-8") as f:
                json.dump(rows_data, f, indent=2, ensure_ascii=False)
                
            print("\nSuccessfully saved parsed rows to scratch/parsed_collection_rows.json")
            
    except Exception as e:
        print(f"Error fetching collection rows: {e}")

if __name__ == "__main__":
    fetch_notion_collection()
