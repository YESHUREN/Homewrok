import urllib.parse
import urllib.request
import ssl
import os

images = [
    ("31039f99-06f5-8065-9057-dd5d960b0300", "attachment:7c8c4067-cea5-400e-8939-2d5007154a0a:Updating_Personal_Information_in_K-Cloud_1.jpg", "kcloud_update1.png"),
    ("31039f99-06f5-8099-838b-c1ab447bb892", "attachment:67f79a96-5bec-47fe-87bd-29a30541ff4f:Updating_Personal_Information_in_K-Cloud_2.jpg", "kcloud_update2.png"),
    ("31039f99-06f5-803c-8067-f6a67d239d21", "attachment:95bc2766-d869-4ef8-96ea-32147a2a99d1:Updating_Personal_Information_in_K-Cloud_3.jpg", "kcloud_update3.png"),
    ("31039f99-06f5-8056-906d-c52ab7fc561a", "attachment:c4cfc0f6-f847-4540-8649-72d45c8333f2:Updating_Personal_Information_in_K-Cloud_4.jpg", "kcloud_update4.png"),
    ("31039f99-06f5-8053-aa18-fa14918540d6", "attachment:6478a159-7f6b-47bb-82df-7fc59b64e192:Updating_Personal_Information_in_K-Cloud_5.jpg", "kcloud_update5.png"),
    ("31039f99-06f5-8090-a75d-fd6283ddb551", "attachment:bdc7f4d3-0fbf-48b5-8c70-a477e4277356:Updating_Personal_Information_in_K-Cloud_6.jpg", "kcloud_update6.png"),
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"
if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for bid, source, dest_name in images:
    encoded_source = urllib.parse.quote(source, safe="")
    url = f"https://notion-api.splitbee.io/v1/image/{encoded_source}?table=block&id={bid}"
    print(f"Downloading {dest_name} from: {url}")
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = res.read()
            dest_path = os.path.join(dest_dir, dest_name)
            with open(dest_path, "wb") as f:
                f.write(data)
            print(f"  Successfully saved to {dest_path} (Size={len(data)} bytes)")
    except Exception as e:
        print(f"  Error downloading {dest_name}: {e}")
