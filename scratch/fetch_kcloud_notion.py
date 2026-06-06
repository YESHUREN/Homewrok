import urllib.request
import json
import ssl
import os

def fetch_page_chunk(page_id):
    if '-' not in page_id:
        page_id = f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
        
    url = "https://www.notion.so/api/v3/loadPageChunk"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    payload = {
        "pageId": page_id,
        "limit": 100,
        "cursor": { "stack": [] },
        "chunkNumber": 0,
        "verticalGroupId": ""
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(payload).encode('utf-8'), 
        headers=headers,
        method="POST"
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            res_data = res.read().decode('utf-8')
            return json.loads(res_data)
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    page_id = "31039f9906f58024b826d31ca6a9c599"
    res = fetch_page_chunk(page_id)
    if not res:
        print("Failed to fetch page.")
        return
        
    record_map = res.get("recordMap", {})
    block_map = record_map.get("block", {})
    
    # Save the raw json to scratch for debugging
    with open("scratch/kcloud_notion_raw.json", "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    print("Saved raw page map to scratch/kcloud_notion_raw.json")
    
    # Traverse blocks from the root page block
    # Find the block for the page itself
    page_block_id = None
    for bid, b in block_map.items():
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if isinstance(val, dict) and val.get("type") == "page":
            page_block_id = bid
            break
            
    if not page_block_id:
        # Just use the normalized page_id
        normalized_id = f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
        page_block_id = normalized_id
        
    def get_block_text(block_id, depth=0):
        b = block_map.get(block_id, {})
        val = b.get("value", {})
        if isinstance(val, dict) and "value" in val:
            val = val["value"]
        if not isinstance(val, dict):
            return []
            
        btype = val.get("type")
        properties = val.get("properties", {})
        
        text = ""
        if properties:
            for k, v in properties.items():
                if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                    text = v[0][0]
                    break
                    
        # Check if block has format (e.g. image source)
        format_info = val.get("format", {})
        display_source = format_info.get("display_source", "")
        
        res = [{
            "id": block_id,
            "type": btype,
            "text": text,
            "display_source": display_source,
            "depth": depth,
            "properties": properties
        }]
        
        children = val.get("content", [])
        for cid in children:
            res.extend(get_block_text(cid, depth + 1))
        return res
        
    full_content = get_block_text(page_block_id, 0)
    
    # Save the parsed text content
    with open("scratch/kcloud_notion_content.txt", "w", encoding="utf-8") as f:
        for item in full_content:
            indent = "  " * item["depth"]
            line = f"{indent}- [{item['type']}] text='{item['text']}'"
            if item["display_source"]:
                line += f" source='{item['display_source']}'"
            f.write(line + "\n")
            print(line)
            
    print("Saved text summary to scratch/kcloud_notion_content.txt")

if __name__ == "__main__":
    main()
