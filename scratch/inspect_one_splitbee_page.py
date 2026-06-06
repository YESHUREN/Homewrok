import urllib.request
import json
import ssl
import os

def inspect_page():
    page_id = "22439f99-06f5-813a-a3de-dbda97cbd28b" # Tuition page with dashes
    url = f"https://notion-api.splitbee.io/v1/page/{page_id}"
    print(f"Fetching raw page JSON from {url}...")
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            record_map = json.loads(res.read().decode('utf-8'))
            
        # Save raw JSON for inspection
        out_filename = "scratch/tuition_page_raw.json"
        with open(out_filename, "w", encoding="utf-8") as f:
            json.dump(record_map, f, indent=2, ensure_ascii=False)
        print(f"Saved raw page JSON to {out_filename}")
        
        # Scan blocks
        types = {}
        table_blocks = []
        for bid, b in record_map.items():
            val = b.get("value", {}).get("value", {})
            if not val:
                continue
            btype = val.get("type")
            types[btype] = types.get(btype, 0) + 1
            if btype in ["table", "table_row"]:
                table_blocks.append((bid, btype, val))
                
        print(f"Block types in page: {types}")
        print(f"Found {len(table_blocks)} table blocks.")
        for bid, btype, val in table_blocks[:3]:
            print(f"\n{btype} block ID {bid}:")
            print(json.dumps(val, indent=2, ensure_ascii=False))
            print("-" * 60)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_page()
