import json

with open("scratch/kcloud_notion_splitbee.json", "r", encoding="utf-8") as f:
    content = f.read()

# Find all occurrences of http:// or https://
import re
urls = re.findall(r'https?://[^\s"\',]+', content)
print(f"Found {len(urls)} URLs in the JSON:")
for u in set(urls)[:20]:
    print(u)
