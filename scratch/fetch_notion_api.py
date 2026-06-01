import urllib.request
import json
import uuid

def fetch_notion_page(page_id):
    # Format UUID if necessary
    if "-" not in page_id:
        page_id = f"{page_id[:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
    
    url = "https://www.notion.so/api/v3/loadPageChunk"
    
    payload = {
        "pageId": page_id,
        "limit": 100,
        "cursor": {"stack": []},
        "chunkNumber": 0,
        "verticalColumns": False
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
            
            # Print page title and block titles
            record_map = res_json.get("recordMap", {})
            block_map = record_map.get("block", {})
            
            print(f"--- Loaded KNU Notion Page ---")
            print(f"Total Blocks Found: {len(block_map)}")
            
            blocks_info = []
            for bid, block in block_map.items():
                val = block.get("value", {})
                btype = val.get("type")
                properties = val.get("properties", {})
                title = properties.get("title", [[""]])
                title_text = "".join([t[0] for t in title if isinstance(t, list) and len(t) > 0])
                
                # Check for collections/tables
                if btype in ["collection_view", "collection_view_page"]:
                    print(f"Block Collection: {btype} ({bid})")
                
                if title_text.strip():
                    blocks_info.append(f"- [{btype}] {title_text}")
                    print(f"[{btype}] {title_text}")
                    
            with open("scratch/notion_result.json", "w", encoding="utf-8") as f:
                json.dump(res_json, f, indent=2, ensure_ascii=False)
                
            print("\nSuccessfully saved raw JSON to scratch/notion_result.json")
            
    except Exception as e:
        print(f"Error fetching page chunk: {e}")

if __name__ == "__main__":
    fetch_notion_page("22439f9906f5806182d4ff4e48d59c70")
