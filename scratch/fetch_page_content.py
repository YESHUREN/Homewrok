import urllib.request
import json
import ssl

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
        print(f"Error fetching page chunk for {page_id}: {e}")
        return None

def test_fetch():
    # Page: 国际化团队介绍
    block_id = "22439f9906f581d0b8bed755a0ac04f5"
    record_map = fetch_page_chunk(block_id)
    if record_map:
        with open("scratch/sample_page_record_map.json", "w", encoding="utf-8") as f:
            json.dump(record_map, f, indent=2, ensure_ascii=False)
            
        print("Successfully fetched page chunk.")
        
        # Let's count blocks
        block_map = record_map.get("recordMap", {}).get("block", {})
        print(f"Total blocks in recordMap: {len(block_map)}")
        
        # Let's print out block types and properties
        for bid, b in block_map.items():
            val = b.get("value", {})
            if isinstance(val, dict) and "value" in val:
                val = val["value"]
            if not isinstance(val, dict):
                continue
                
            btype = val.get("type")
            properties = val.get("properties", {})
            title = ""
            if properties and "title" in properties:
                title = properties["title"][0][0]
            print(f"  Block {bid}: Type={btype}, Title/Text='{title[:100]}'")

if __name__ == "__main__":
    test_fetch()
