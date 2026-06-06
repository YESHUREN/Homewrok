import urllib.request
import json
import ssl
import os

def get_signed_urls():
    url = "https://www.notion.so/api/v3/getSignedFileUrls"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    # The 6 image blocks from the K-Cloud Notion page
    images = [
        {"bid": "31039f99-06f5-8065-9057-dd5d960b0300", "source": "attachment:7c8c4067-cea5-400e-8939-2d5007154a0a:Updating_Personal_Information_in_K-Cloud_1.jpg"},
        {"bid": "31039f99-06f5-8099-838b-c1ab447bb892", "source": "attachment:67f79a96-5bec-47fe-87bd-29a30541ff4f:Updating_Personal_Information_in_K-Cloud_2.jpg"},
        {"bid": "31039f99-06f5-803c-8067-f6a67d239d21", "source": "attachment:95bc2766-d869-4ef8-96ea-32147a2a99d1:Updating_Personal_Information_in_K-Cloud_3.jpg"},
        {"bid": "31039f99-06f5-8056-906d-c52ab7fc561a", "source": "attachment:c4cfc0f6-f847-4540-8649-72d45c8333f2:Updating_Personal_Information_in_K-Cloud_4.jpg"},
        {"bid": "31039f99-06f5-8053-aa18-fa14918540d6", "source": "attachment:6478a159-7f6b-47bb-82df-7fc59b64e192:Updating_Personal_Information_in_K-Cloud_5.jpg"},
        {"bid": "31039f99-06f5-8090-a75d-fd6283ddb551", "source": "attachment:bdc7f4d3-0fbf-48b5-8c70-a477e4277356:Updating_Personal_Information_in_K-Cloud_6.jpg"},
    ]
    
    urls_payload = []
    for img in images:
        urls_payload.append({
            "url": img["source"],
            "permissionRecord": {
                "table": "block",
                "id": img["bid"]
            }
        })
        
    payload = {"urls": urls_payload}
    
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
        print(f"Error calling getSignedFileUrls: {e}")
        return None

def main():
    res = get_signed_urls()
    if not res:
        print("Failed to get signed URLs.")
        return
        
    # Save raw signed urls response
    with open("scratch/kcloud_signed_urls.json", "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
        
    print("Signed URLs response:")
    signed_urls = res.get("signedUrls", [])
    for idx, signed_url in enumerate(signed_urls):
        print(f"Image {idx+1}: {signed_url[:150]}...")

if __name__ == "__main__":
    main()
