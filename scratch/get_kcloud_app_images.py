import urllib.request
import urllib.parse
import json
import ssl
import os

def get_signed_urls():
    url = "https://www.notion.so/api/v3/getSignedFileUrls"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    # The 15 unique images from the K-Cloud & KNU App Notion page
    images = [
        {"bid": "26a39f99-06f5-811c-86a6-c16be0ed03fb", "source": "attachment:9c2f9b50-59db-4ce2-9361-e7deb6a5dd65:image.png"},
        {"bid": "26a39f99-06f5-811c-9585-d2553cf89954", "source": "attachment:3bc87fce-f5eb-4636-a6cc-73ec353e040c:화면_캡처_2025-09-08_110537.jpg"},
        {"bid": "26a39f99-06f5-81f0-8dd8-d821b1dfd510", "source": "attachment:6033b1e7-379d-437e-b911-ec97562adf9a:캡처1.jpg"},
        {"bid": "26a39f99-06f5-81a5-9ff9-ec49e7b80efd", "source": "attachment:3b19e6c0-72e3-498b-990d-e7ab28036cf0:교과_클릭.jpg"},
        {"bid": "26a39f99-06f5-81bc-b0e1-ff40b710dcae", "source": "attachment:725a100b-3fc5-489f-addc-a0e0236bde65:신상정보변경_클릭.jpg"},
        {"bid": "26a39f99-06f5-81f0-ab10-c968444c5879", "source": "attachment:9a910e8f-cbf0-4256-a956-1606b063d63b:신상_정보_은행.jpg"},
        {"bid": "26a39f99-06f5-8110-93a6-d4efa74a5126", "source": "attachment:d5b4c09b-04b2-4697-944f-fe303d08f980:저장_클릭.jpg"},
        {"bid": "26a39f99-06f5-81a4-b044-f847e953a790", "source": "attachment:e98b9291-d902-43c0-8877-abe6e4c8988f:휴대폰_번호_변경.jpg"},
        {"bid": "26a39f99-06f5-812f-b325-d4b6517ae223", "source": "attachment:82cbe0f9-7900-40da-b644-1258ba57dd27:image.png"},
        {"bid": "26a39f99-06f5-812a-8ee8-ff0a7b64d85e", "source": "attachment:ccbd646a-11af-47d3-adda-6915175fdd80:image.png"},
        {"bid": "26a39f99-06f5-81a0-a848-eb69371c05d2", "source": "attachment:45538538-bb28-4308-b67e-b8779bffabbe:KakaoTalk_20250908_112118825.png"},
        {"bid": "26a39f99-06f5-8145-9750-c6706f3f7264", "source": "attachment:1c18a15c-4415-4edc-ab7f-060c9f7ae6b1:KakaoTalk_20250908_093515701_02.jpg"},
        {"bid": "26a39f99-06f5-8190-ba62-c6a0ba8e3f5e", "source": "attachment:f2279672-6f52-4c9b-9564-cf5b595d11a7:KakaoTalk_20250908_093515701_01.jpg"},
        {"bid": "26a39f99-06f5-81d0-ba8b-eeaf65517213", "source": "attachment:f54bbbf1-54ca-40eb-90ed-1aa7e6bdff1c:KakaoTalk_20250908_093515701.jpg"},
        {"bid": "26a39f99-06f5-8158-a02f-e9c512d3e2be", "source": "attachment:0b238ac7-93f3-43d8-8ac4-19f7b0d3eb47:image.png"},
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

def quote_url(url):
    scheme, netloc, path, query, fragment = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(path)
    return urllib.parse.urlunsplit((scheme, netloc, path, query, fragment))

def main():
    res = get_signed_urls()
    if not res:
        print("Failed to get signed URLs.")
        return
        
    signed_urls = res.get("signedUrls", [])
    
    dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    image_mappings = []
    
    for idx, url in enumerate(signed_urls):
        quoted = quote_url(url)
        print(f"Downloading image {idx+1}/{len(signed_urls)}...")
        req = urllib.request.Request(quoted, headers=headers)
        
        try:
            with urllib.request.urlopen(req, context=ctx) as r:
                data = r.read()
                
                # Check header magic bytes
                ext = ".png"
                if data.startswith(b"\xff\xd8\xff"):
                    ext = ".jpg"
                elif data.startswith(b"\x89PNG\r\n\x1a\n"):
                    ext = ".png"
                    
                dest_name = f"knu_app_img{idx+1}{ext}"
                dest_path = os.path.join(dest_dir, dest_name)
                
                with open(dest_path, "wb") as f_out:
                    f_out.write(data)
                print(f"  Saved to {dest_name} ({len(data)} bytes)")
                image_mappings.append(dest_name)
        except Exception as e:
            print(f"  Error downloading image {idx+1}: {e}")
            
    print("\nAll downloaded images:")
    for m in image_mappings:
        print(m)

if __name__ == "__main__":
    main()
