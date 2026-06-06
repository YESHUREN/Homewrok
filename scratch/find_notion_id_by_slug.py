import urllib.request
import ssl
import re

url = "https://knusamcheokoia.notion.site/k-cloud-ch?pvs=143"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    url, 
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)

try:
    with urllib.request.urlopen(req, context=ctx) as res:
        final_url = res.geturl()
        html = res.read().decode('utf-8')
        print(f"Final URL: {final_url}")
        
        # Check for standard 32-char UUIDs in final_url
        uuid_match = re.search(r'([a-f0-9]{32})', final_url)
        if uuid_match:
            print(f"Found page ID in final URL: {uuid_match.group(1)}")
        else:
            # Let's search inside the HTML for the pageId
            page_id_match = re.search(r'"pageId"\s*:\s*"([a-f0-9\-]+)"', html)
            if page_id_match:
                print(f"Found pageId in script block: {page_id_match.group(1)}")
            else:
                # Search for any 32-character hex ID in script tags
                hex_matches = re.findall(r'/[a-f0-9]{32}', html)
                if hex_matches:
                    print(f"Found hex matches in HTML: {list(set(hex_matches))}")
                else:
                    print("Could not find any Page ID in URL or HTML content.")
except Exception as e:
    print(f"Error fetching URL: {e}")
