import os
import shutil

src_dir = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30"
dest_dir = r"c:\Users\27916\Downloads\在韩留学生服务社区\public"

# The e-RURI tutorial images
file_login = os.path.join(src_dir, "media__1780467746910.png")
file_dashboard = os.path.join(src_dir, "media__1780467782088.png")

shutil.copy(file_login, os.path.join(dest_dir, "eruri_login.png"))
shutil.copy(file_dashboard, os.path.join(dest_dir, "eruri_dashboard.png"))

print("Copied files to public/ successfully:")
print("eruri_login.png exists:", os.path.exists(os.path.join(dest_dir, "eruri_login.png")))
print("eruri_dashboard.png exists:", os.path.exists(os.path.join(dest_dir, "eruri_dashboard.png")))
