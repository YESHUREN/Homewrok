import os

public_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

print("Renaming kcloud_update images to .jpg and cleaning up old .png files...")
for i in range(1, 7):
    old_name = f"kcloud_update{i}.png"
    new_name = f"kcloud_update{i}.jpg"
    
    old_path = os.path.join(public_dir, old_name)
    new_path = os.path.join(public_dir, new_name)
    
    # Check if the old file exists and is indeed a JPEG under the hood
    if os.path.exists(old_path):
        # If the destination already exists, remove it first
        if os.path.exists(new_path):
            os.remove(new_path)
        os.rename(old_path, new_path)
        print(f"Renamed {old_name} to {new_name}")
    else:
        print(f"{old_name} not found, checking if {new_name} already exists...")
        if os.path.exists(new_path):
            print(f"  {new_name} already exists.")
        else:
            print(f"  Warning: neither {old_name} nor {new_name} exists!")

# Double check that no kcloud_update*.png files are left
for f in os.listdir(public_dir):
    if f.startswith("kcloud_update") and f.endswith(".png"):
        os.remove(os.path.join(public_dir, f))
        print(f"Removed old leftover file: {f}")
