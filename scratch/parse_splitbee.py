import urllib.request
import json
import ssl
import sys

def fetch_and_parse(page_id):
    url = f"https://notion-api.splitbee.io/v1/page/{page_id}"
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            record_map = json.loads(res.read().decode('utf-8'))
            
            page_uuid = page_id
            if "-" not in page_uuid:
                page_uuid = f"{page_uuid[:8]}-{page_uuid[8:12]}-{page_uuid[12:16]}-{page_uuid[16:20]}-{page_uuid[20:]}"
                
            page_block = record_map.get(page_uuid, {}).get("value", {}).get("value", {})
            if not page_block:
                # Try finding any block of type "page"
                for bid, b in record_map.items():
                    val = b.get("value", {}).get("value", {})
                    if val.get("type") == "page" and val.get("id").replace("-", "") == page_id.replace("-", ""):
                        page_block = val
                        page_uuid = bid
                        break
            
            if not page_block:
                print("Page block not found.")
                return
                
            ordered_child_ids = page_block.get("content", [])
            title = page_block.get('properties', {}).get('title', [[""]])[0][0]
            print(f"Page Title: {title}")
            print(f"Total children blocks in page: {len(ordered_child_ids)}")
            
            def parse_block(bid, depth=0):
                b = record_map.get(bid, {}).get("value", {}).get("value", {})
                if not b:
                    return []
                btype = b.get("type")
                properties = b.get("properties", {})
                
                # Extract text
                text = ""
                if properties:
                    for k, v in properties.items():
                        if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                            text = "".join([item[0] for item in v if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                            break
                            
                res = [(btype, text, depth)]
                
                children = b.get("content", [])
                for cid in children:
                    res.extend(parse_block(cid, depth + 1))
                return res
                
            all_text_blocks = []
            for cid in ordered_child_ids:
                all_text_blocks.extend(parse_block(cid, 0))
                
            out_lines = []
            out_lines.append(f"PAGE: {title} (ID: {page_id})")
            for btype, text, depth in all_text_blocks:
                out_lines.append(f"{'  ' * depth}[{btype}] {text}")
                
            out_filename = f"scratch/notion_page_{page_id}.txt"
            with open(out_filename, "w", encoding="utf-8") as f:
                f.write("\n".join(out_lines))
            print(f"Saved parsed page blocks to {out_filename}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_and_parse("22439f9906f5810e9387d121d8ff26fc")
