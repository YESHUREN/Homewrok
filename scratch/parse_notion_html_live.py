import re
from html.parser import HTMLParser

file_path = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\steps\6641\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Get the HTML part (line 9)
lines = text.split("\n")
html_content = lines[8] if len(lines) > 8 else text

class NotionHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""
        self.headings = []
        self.current_tag = None
        self.current_data = []
        
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag == "title":
            self.in_title = True
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            self.current_data = []
        elif tag == "img":
            attrs_dict = dict(attrs)
            print(f"Image: src={attrs_dict.get('src')} | alt={attrs_dict.get('alt')}")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            heading_text = "".join(self.current_data).strip()
            self.headings.append((tag, heading_text))
            self.current_data = []
        self.current_tag = None

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.current_tag in ["h1", "h2", "h3", "h4", "h5", "h6", "span", "div", "a", "p"]:
            self.current_data.append(data)

parser = NotionHTMLParser()
parser.feed(html_content)

print("=== Page Title ===")
print(parser.title.strip())

print("\n=== Headings ===")
for tag, val in parser.headings:
    print(f"{tag}: {val}")

# Let's extract any URLs or texts that might contain table content or image links
print("\n=== Extracted Text Snippets ===")
all_text = re.sub('<[^<]+?>', ' ', html_content)
all_text = re.sub(r'\s+', ' ', all_text)
# Print first 2000 chars of visible text
print(all_text[:2000])
