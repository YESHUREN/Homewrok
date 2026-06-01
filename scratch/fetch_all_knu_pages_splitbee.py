import urllib.request
import json
import ssl
import os
import time
import sys

# Configure stdout to use UTF-8 to prevent GBK encoding errors in Windows console
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

# We will read KNU_GUIDE_ITEMS from c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_data.ts
# Since it's a TS file, we can parse it using a simple regex or string parsing in Python, or we can just import the JSON list that was loaded in inspect_knu_pages_list_results.txt!
# Wait, let's load inspect_knu_pages_list_results.txt first, or let's parse knu_guides_data.ts directly!
# The format in knu_guides_data.ts is:
#   {
#     id: "22439f9906f581d0b8bed755a0ac04f5",
#     titleZh: "国际化团队介绍",
#     ...
#   }

ts_file_path = r"c:\Users\27916\Downloads\在韩留学生服务社区\src\components\knu_guides_data.ts"
with open(ts_file_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Let's extract ids and titles
import re
items = re.findall(r'id:\s*"([a-f0-9]+)",\s*titleZh:\s*"([^"]+)"', ts_content)
print(f"Extracted {len(items)} items from knu_guides_data.ts:")
for item in items[:5]:
    print(f"  - {item[1]} ({item[0]})")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

scratch_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch"
if not os.path.exists(scratch_dir):
    os.makedirs(scratch_dir)

count = 0
for page_id, name in items:
    out_filename = os.path.join(scratch_dir, f"notion_page_{page_id}.txt")
    print(f"Fetching {name} ({page_id})...")
    url = f"https://notion-api.splitbee.io/v1/page/{page_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            record_map = json.loads(res.read().decode('utf-8'))
            
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
                    # Get parent table columns order if available
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
                        # Fallback sorted by key
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
            
    except Exception as e:
        print(f"  Error fetching {name}: {e}")
        
    time.sleep(0.5)

print(f"\nSuccessfully fetched {count} new pages.")
