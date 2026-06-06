import json
import urllib.request
import ssl
import os

def download_images():
    with open("scratch/kcloud_signed_urls.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    signed_urls = data.get("signedUrls", [])
    
    dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    for idx, url in enumerate(signed_urls):
        dest_name = f"kcloud_update{idx+1}.png"
        dest_path = os.path.join(dest_dir, dest_name)
        
        print(f"Downloading {dest_name}...")
        req = urllib.request.Request(url, headers=headers)
        
        try:
            with urllib.request.urlopen(req, context=ctx) as res:
                img_data = res.read()
                with open(dest_path, "wb") as f_out:
                    f_out.write(img_data)
                print(f"  Successfully downloaded to {dest_path} ({len(img_data)} bytes)")
        except Exception as e:
            print(f"  Error downloading {dest_name}: {e}")

if __name__ == "__main__":
    download_images()
