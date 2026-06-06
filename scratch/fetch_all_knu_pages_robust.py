import urllib.request
import json
import ssl
import os
import time
import sys
import re

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

ts_file_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_data.ts"
with open(ts_file_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

items = re.findall(r'id:\s*"([a-f0-9]+)",\s*titleZh:\s*"([^"]+)"', ts_content)
print(f"Loaded {len(items)} items from knu_guides_data.ts")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
if not os.path.exists(scratch_dir):
    os.makedirs(scratch_dir)

def fetch_page_with_retry(page_id, name, max_retries=3):
    url = f"https://notion-api.splitbee.io/v1/page/{page_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
    
    for attempt in range(1, max_retries + 1):
        try:
            with urllib.request.urlopen(req, context=ctx) as res:
                record_map = json.loads(res.read().decode('utf-8'))
                return record_map
        except Exception as e:
            print(f"  Attempt {attempt} failed for {name} ({page_id}): {e}")
            if attempt < max_retries:
                time.sleep(3)
            else:
                return None

count = 0
for page_id, name in items:
    out_filename = os.path.join(scratch_dir, f"notion_page_{page_id}.txt")
    
    # We want to re-fetch all pages to ensure multi-column table rows are fully written!
    print(f"[{count+1}/{len(items)}] Fetching {name} ({page_id})...")
    record_map = fetch_page_with_retry(page_id, name)
    
    if not record_map:
        print(f"  FAILED to fetch {name} after retries. Keeping old file if exists.")
        continue
        
    page_uuid = page_id
    if "-" not in page_uuid:
        page_uuid = f"{page_uuid[:8]}-{page_uuid[8:12]}-{page_uuid[12:16]}-{page_uuid[16:20]}-{page_uuid[20:]}"
        
    page_block = record_map.get(page_uuid, {}).get("value", {}).get("value", {})
    if not page_block:
        for bid, b in record_map.items():
            val = b.get("value", {}).get("value", {})
            if val.get("type") == "page" and val.get("id").replace("-", "") == page_id.replace("-", ""):
                page_block = val
                page_uuid = bid
                break
                
    if not page_block:
        print(f"  Page block not found for {name}.")
        continue
        
    ordered_child_ids = page_block.get("content", [])
    
    def parse_block(bid, depth=0):
        b = record_map.get(bid, {}).get("value", {}).get("value", {})
        if not b:
            return []
        btype = b.get("type")
        properties = b.get("properties", {})
        
        text = ""
        if btype == "table_row":
            parent_id = b.get("parent_id")
            b_parent = record_map.get(parent_id, {}).get("value", {}).get("value", {})
            cols = b_parent.get("format", {}).get("table_block_properties", [])
            col_ids = [c["property"] for c in cols]
            
            cells = []
            if col_ids:
                for col_id in col_ids:
                    cell_val = properties.get(col_id, [])
                    cell_text = "".join([item[0] for item in cell_val if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                    cells.append(cell_text)
            else:
                for k, v in sorted(properties.items()):
                    if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                        cell_text = "".join([item[0] for item in v if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                        cells.append(cell_text)
            text = " | ".join(cells)
        else:
            if properties:
                for k, v in properties.items():
                    if isinstance(v, list) and len(v) > 0 and isinstance(v[0], list):
                        text = "".join([item[0] for item in v if isinstance(item, list) and len(item) > 0 and isinstance(item[0], str)])
                        break
                        
        res_list = [(btype, text, depth)]
        
        children = b.get("content", [])
        for cid in children:
            res_list.extend(parse_block(cid, depth + 1))
        return res_list

    all_text_blocks = []
    for cid in ordered_child_ids:
        all_text_blocks.extend(parse_block(cid, 0))
        
    out_lines = []
    out_lines.append(f"PAGE: {name} (ID: {page_id})")
    for btype, text, depth in all_text_blocks:
        if btype == "image" and ("KB" in text or "MB" in text):
            out_lines.append(f"{'  ' * depth}[{btype}]")
        else:
            out_lines.append(f"{'  ' * depth}[{btype}] {text}")
            
    with open(out_filename, "w", encoding="utf-8") as f_out:
        f_out.write("\n".join(out_lines))
    print(f"  Saved to {out_filename}")
    count += 1
    
    # 1.5s sleep to respect rate limits of Notion and Vercel functions
    time.sleep(1.5)

print(f"\nCompleted! Re-fetched and updated {count} guides with full table structures.")
