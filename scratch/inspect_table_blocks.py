import json
import os

def scan_blocks():
    for filename in ["scratch/notion_result.json", "scratch/collection_rows.json", "scratch/sample_public_page.json"]:
        if not os.path.exists(filename):
            continue
        print(f"Scanning {filename}...")
        try:
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Find block structures
            record_map = data.get("recordMap", {})
            block_map = record_map.get("block", {})
            
            types = {}
            table_row_blocks = []
            
            for bid, b in block_map.items():
                val = b.get("value", {})
                if isinstance(val, dict) and "value" in val:
                    val = val["value"]
                if not isinstance(val, dict):
                    continue
                
                btype = val.get("type")
                types[btype] = types.get(btype, 0) + 1
                
                if btype in ["table_row", "table"]:
                    table_row_blocks.append((bid, btype, val))
            
            print(f"  Block types found: {types}")
            print(f"  Found {len(table_row_blocks)} table/table_row blocks.")
            
            for bid, btype, val in table_row_blocks[:5]:
                print(f"  Example {btype} Block ID {bid}:")
                print(json.dumps(val, indent=2, ensure_ascii=False)[:1000])
                print("-" * 50)
                
        except Exception as e:
            print(f"  Error reading {filename}: {e}")

if __name__ == "__main__":
    scan_blocks()
