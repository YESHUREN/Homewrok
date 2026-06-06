import os

dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

for i in range(1, 7):
    filename = f"kcloud_update{i}.png"
    filepath = os.path.join(dest_dir, filename)
    if not os.path.exists(filepath):
        print(f"{filename} does not exist!")
        continue
        
    size = os.path.getsize(filepath)
    with open(filepath, "rb") as f:
        header = f.read(8)
    
    # Check magic numbers
    format_detected = "Unknown"
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        format_detected = "PNG"
    elif header.startswith(b"\xff\xd8\xff"):
        format_detected = "JPEG"
    elif header.startswith(b"GIF89a") or header.startswith(b"GIF87a"):
        format_detected = "GIF"
        
    print(f"{filename}: size={size} bytes, detected format={format_detected}, header={header.hex()}")
