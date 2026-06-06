import urllib.request
import json
import ssl
import os

def fetch_public_page(page_id):
    if '-' not in page_id:
        page_id = f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
        
    url = "https://www.notion.so/api/v3/getPublicPageData"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    payload = {
        "blockId": page_id,
        "name": "page",
        "spaceId": "db713885-d348-4029-9b04-7f3d52d07387" # default workspace spaceId from other files
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
        print(f"Error calling getPublicPageData: {e}")
        return None

def main():
    page_id = "31039f9906f58024b826d31ca6a9c599"
    res = fetch_public_page(page_id)
    if not res:
        print("Failed to fetch public page.")
        # Try without spaceId
        print("Trying without spaceId...")
        url = "https://www.notion.so/api/v3/getPublicPageData"
        payload = {
            "blockId": f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}",
            "name": "page"
        }
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        try:
            with urllib.request.urlopen(req, context=ctx) as r:
                res = json.loads(r.read().decode('utf-8'))
                print("Success without spaceId!")
        except Exception as e:
            print(f"Failed without spaceId too: {e}")
            return
            
    # Save raw
    with open("scratch/kcloud_notion_public_raw.json", "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    print("Saved public raw response.")
    
    # Check block structure
    # getPublicPageData typically returns spaceName, type, and block recordMap
    record_map = res.get("recordMap", {})
    block_map = record_map.get("block", {})
    print(f"Number of blocks retrieved: {len(block_map)}")
    
    # Traverse blocks from page block
    page_block_id = f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
    
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
                    # Also try to extract formatting if it's links
                    break
                    
        # Check if block has format (e.g. image source or file size)
        format_info = val.get("format", {})
        display_source = format_info.get("display_source", "")
        
        res_list = [{
            "id": block_id,
            "type": btype,
            "text": text,
            "display_source": display_source,
            "depth": depth,
            "properties": properties
        }]
        
        children = val.get("content", [])
        for cid in children:
            res_list.extend(get_block_text(cid, depth + 1))
        return res_list
        
    full_content = get_block_text(page_block_id, 0)
    
    with open("scratch/kcloud_notion_public_content.txt", "w", encoding="utf-8") as f:
        for item in full_content:
            indent = "  " * item["depth"]
            line = f"{indent}- [{item['type']}] text='{item['text']}'"
            if item["display_source"]:
                line += f" source='{item['display_source']}'"
            f.write(line + "\n")
            print(line)

if __name__ == "__main__":
    main()
