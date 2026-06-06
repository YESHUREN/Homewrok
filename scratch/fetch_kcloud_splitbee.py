import urllib.request
import json
import ssl
import os

def fetch_splitbee(page_id):
    url = f"https://notion-api.splitbee.io/v1/page/{page_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            return json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching from splitbee: {e}")
        return None

def main():
    page_id = "31039f9906f58024b826d31ca6a9c599"
    res = fetch_splitbee(page_id)
    if not res:
        print("Failed to fetch via splitbee.")
        return
        
    with open("scratch/kcloud_notion_splitbee.json", "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    print("Saved splitbee raw JSON to scratch/kcloud_notion_splitbee.json")
    
    # Let's print out the blocks
    page_uuid = page_id
    if "-" not in page_uuid:
        page_uuid = f"{page_uuid[:8]}-{page_uuid[8:12]}-{page_uuid[12:16]}-{page_uuid[16:20]}-{page_uuid[20:]}"
        
    # Find page block
    page_block = res.get(page_uuid, {}).get("value", {}).get("value", {})
    if not page_block:
        for bid, b in res.items():
            val = b.get("value", {}).get("value", {})
            if val.get("type") == "page" and val.get("id").replace("-", "") == page_id:
                page_block = val
                page_uuid = bid
                break
                
    if not page_block:
        print("Page block not found in response!")
        return
        
    ordered_child_ids = page_block.get("content", [])
    
    def parse_block(bid, depth=0):
        b = res.get(bid, {}).get("value", {}).get("value", {})
        if not b:
            return []
        btype = b.get("type")
        properties = b.get("properties", {})
        format_info = b.get("format", {})
        display_source = format_info.get("display_source", "")
        
        text = ""
        if properties:
            for k, v in properties.items():
                if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                    text = "".join([item[0] for item in v if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                    break
                    
        res_list = [(btype, text, display_source, depth)]
        
        children = b.get("content", [])
        for cid in children:
            res_list.extend(parse_block(cid, depth + 1))
        return res_list

    all_blocks = []
    for cid in ordered_child_ids:
        all_blocks.extend(parse_block(cid, 0))
        
    with open("scratch/kcloud_notion_splitbee_content.txt", "w", encoding="utf-8") as f_out:
        for btype, text, source, depth in all_blocks:
            indent = "  " * depth
            line = f"{indent}[{btype}] {text}"
            if source:
                line += f" (source: {source})"
            f_out.write(line + "\n")
            print(line)

if __name__ == "__main__":
    main()
