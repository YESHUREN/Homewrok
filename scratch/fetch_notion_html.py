import urllib.request
import ssl

def fetch_html():
    url = "https://knusamcheokoia.notion.site/22439f9906f581d0b8bed755a0ac04f5"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            html = res.read().decode('utf-8')
            print(f"Successfully fetched HTML. Size: {len(html)} characters.")
            with open("scratch/sample_page.html", "w", encoding="utf-8") as f:
                f.write(html)
            
            # Print a snippet containing some text
            print("\nSnippet of HTML (first 1000 chars):")
            print(html[:1000])
            
    except Exception as e:
        print(f"Error fetching HTML: {e}")

if __name__ == "__main__":
    fetch_html()
