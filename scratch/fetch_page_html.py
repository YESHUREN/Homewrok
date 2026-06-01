import urllib.request
import ssl
import re

def fetch_html(page_id):
    url = f"https://knusamcheokoia.notion.site/{page_id}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            html = res.read().decode('utf-8')
            print(f"Successfully fetched HTML of size: {len(html)}")
            
            # Let's search for "맛집" or other text inside the html
            print("Searching for Korean character ranges...")
            korean_chars = re.findall(r'[\uac00-\ud7a3]+', html)
            print(f"Found {len(korean_chars)} Korean words.")
            print(f"Sample Korean words: {korean_chars[:50]}")
            
            # Let's save a snippet of the script blocks
            scripts = re.findall(r'<script.*?>.*?</script>', html, re.DOTALL)
            print(f"Found {len(scripts)} script tags.")
            
            for idx, s in enumerate(scripts):
                if "bootData" in s or "recordMap" in s or "state" in s:
                    print(f"Script {idx} contains bootData/recordMap/state (size: {len(s)})")
                    with open(f"scratch/script_{idx}.txt", "w", encoding="utf-8") as f:
                        f.write(s)
            
            with open("scratch/page_raw.html", "w", encoding="utf-8") as f:
                f.write(html)
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_html("22439f9906f5810e9387d121d8ff26fc")
