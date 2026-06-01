import json
import os

source_file = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch\notion_result.json"

if not os.path.exists(source_file):
    print("Source file not found")
    exit(1)

with open(source_file, "r", encoding="utf-8") as f:
    data = json.load(f)

record_map = data.get("recordMap", {})
block_map = record_map.get("block", {})

print(f"Loaded {len(block_map)} blocks.")

# Extract all pages
pages = {}
for bid, block in block_map.items():
    val = block.get("value", {})
    if isinstance(val, dict) and "value" in val:
        val = val["value"]
    if not isinstance(val, dict):
        continue
    
    btype = val.get("type")
    if btype == "page":
        # Extract title
        properties = val.get("properties", {})
        title_list = properties.get("title", [])
        title = ""
        if title_list and isinstance(title_list, list):
            title = "".join([t[0] for t in title_list if isinstance(t, list) and len(t) > 0 and isinstance(t[0], str)])
        
        pages[bid] = {
            "id": bid,
            "title": title,
            "blocks": []
        }

# Group child blocks
for bid, block in block_map.items():
    val = block.get("value", {})
    if isinstance(val, dict) and "value" in val:
        val = val["value"]
    if not isinstance(val, dict):
        continue
    
    parent_id = val.get("parent_id")
    parent_table = val.get("parent_table")
    
    if parent_id in pages and parent_table == "block":
        pages[parent_id]["blocks"].append(val)

# For each page, let's reconstruct the textual content
out_lines = []
for p_id, p in pages.items():
    title = p["title"]
    if not title:
        continue
    
    out_lines.append(f"=== PAGE: {title} (ID: {p_id}) ===")
    
    # Sort child blocks by parent's content order if available
    parent_block = block_map.get(p_id, {}).get("value", {})
    if isinstance(parent_block, dict) and "value" in parent_block:
        parent_block = parent_block["value"]
        
    ordered_child_ids = parent_block.get("content", [])
    child_blocks_dict = {b["id"]: b for b in p["blocks"]}
    
    # If no ordered list, just take blocks in any order
    child_ids = ordered_child_ids if ordered_child_ids else list(child_blocks_dict.keys())
    
    for c_id in child_ids:
        b = child_blocks_dict.get(c_id)
        if b:
            btype = b.get("type")
            properties = b.get("properties", {})
            text = ""
            if "title" in properties:
                title_list = properties["title"]
                text = "".join([t[0] for t in title_list if isinstance(t, list) and len(t) > 0 and isinstance(t[0], str)])
            
            # Format according to block type
            if btype == "header":
                out_lines.append(f"\n# {text}")
            elif btype == "sub_header":
                out_lines.append(f"\n## {text}")
            elif btype == "sub_sub_header":
                out_lines.append(f"\n### {text}")
            elif btype == "bulleted_list":
                out_lines.append(f"* {text}")
            elif btype == "numbered_list":
                out_lines.append(f"1. {text}")
            elif btype == "text":
                out_lines.append(text)
            elif btype == "to_do":
                # Check checked state
                checked = "x" if properties.get("checked", [["No"]])[0][0] == "Yes" else " "
                out_lines.append(f"- [{checked}] {text}")
            elif btype == "callout":
                out_lines.append(f"> CALLOUT: {text}")
            elif btype == "image":
                # Get image source
                file_src = b.get("format", {}).get("display_source", "")
                if not file_src:
                    file_src = b.get("properties", {}).get("source", [[""]])[0][0]
                out_lines.append(f"[IMAGE: {file_src}]")
            else:
                if text:
                    out_lines.append(f"[{btype}] {text}")
    
    out_lines.append("\n" + "="*50 + "\n")

output_file = r"c:\Users\27916\Downloads\在韩留学生服务社区\scratch\all_knu_pages_content.txt"
with open(output_file, "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(out_lines))

print(f"Successfully extracted {len(pages)} pages to {output_file}")
