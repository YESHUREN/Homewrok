import urllib.request
import json
import ssl

def fetch_public_page(page_id):
    # Format UUID with hyphens if not present
    if '-' not in page_id:
        page_id = f"{page_id[0:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"
        
    url = "https://www.notion.so/api/v3/getPublicPageData"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    payload = {
        "blockId": page_id,
        "name": "page",
        "spaceId": "db713885-d348-4029-9b04-7f3d52d07387"
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(payload).encode('utf-8'), 
        headers=headers,
        method="POST"
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            res_data = res.read().decode('utf-8')
            return json.loads(res_data)
    except Exception as e:
        print(f"Error calling getPublicPageData for {page_id}: {e}")
        return None

def test():
    page_id = "22439f9906f581d0b8bed755a0ac04f5"
    res = fetch_public_page(page_id)
    if res:
        with open("scratch/sample_public_page.json", "w", encoding="utf-8") as f:
            json.dump(res, f, indent=2, ensure_ascii=False)
        print("Success! Saved response to scratch/sample_public_page.json")
        print(f"Keys in response: {list(res.keys())}")

if __name__ == "__main__":
    test()
