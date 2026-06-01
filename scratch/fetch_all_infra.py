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
    pass  # In case of older python versions that don't support it

infra_guides = {
    "图书馆（施工中🔧）": "22439f9906f581a594f4e3f495abd4c5",
    "宿舍": "22439f9906f581389897fc510572de62",
    "学校体育设施": "22439f9906f5813b9623de1a8f6e83fd",
    "保健室": "22439f9906f58160a388f12fab960737",
    "通勤班车运营指南": "22439f9906f581bcaa79dc2ee00e6454",
    "便利设施": "22439f9906f5817db33be7255c840921",
    "Wi-Fi 及 应用程序": "22439f9906f581a2b16ec868a83f7b3d",
    "校园导览图": "22439f9906f581c38390dc0d87bfbeab",
    "住房、自己做饭生活（合租/独居）、搬家": "22439f9906f581bf8d37d5f08185711b",
    "邮政与快递": "22439f9906f581fe8245d7b5b1f4ea24",
    "医疗设施": "22439f9906f581678e3ec69d141cb27b",
    "公共设施": "22439f9906f581ef9d19f31cc0d7c99c",
    "主要购物场所": "22439f9906f5811db761efd199c881b2",
    "三陟旅游景点": "22439f9906f581228bd4ee06f0604a44",
    "三陟餐厅": "22439f9906f5810e9387d121d8ff26fc",
    "三陟节庆": "22439f9906f581f6bf2bcc2f2755bf10",
    "如何在三陟租房": "2a439f9906f58131b0c2c10627af353b"
}

def fetch_and_parse_all():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    for name, page_id in infra_guides.items():
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
                out_lines.append(f"PAGE: {name} (ID: {page_id})")
                for btype, text, depth in all_text_blocks:
                    # Filter out images size text
                    if btype == "image" and ("KB" in text or "MB" in text):
                        out_lines.append(f"{'  ' * depth}[{btype}]")
                    else:
                        out_lines.append(f"{'  ' * depth}[{btype}] {text}")
                    
                out_filename = f"scratch/notion_page_{page_id}.txt"
                with open(out_filename, "w", encoding="utf-8") as f:
                    f.write("\n".join(out_lines))
                print(f"  Saved to {out_filename}")
                
        except Exception as e:
            print(f"  Error fetching {name}: {e}")
            
        # Avoid hitting rate limits
        time.sleep(0.5)

if __name__ == "__main__":
    fetch_and_parse_all()
