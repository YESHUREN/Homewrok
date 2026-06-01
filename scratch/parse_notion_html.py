import re

def parse_html():
    with open("scratch/sample_page.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    print(f"HTML Length: {len(html)}")
    
    # Check if there is a script containing __INITIAL_STATE__ or recordMap
    matches = re.findall(r'<script>window\.__INITIAL_STATE__\s*=\s*({.*?});</script>', html)
    if matches:
        print("Found window.__INITIAL_STATE__!")
        state = matches[0]
        print(f"State size: {len(state)} chars")
        with open("scratch/sample_state.json", "w", encoding="utf-8") as f_out:
            f_out.write(state)
        return
        
    # Check for any other script tag containing JSON
    scripts = re.findall(r'<script id="[^"]*"[^>]*>(.*?)</script>', html)
    print(f"Found {len(scripts)} script tags with content.")
    
    # Let's search for some Chinese text from "国际化团队介绍" like "团队" or "介绍" in the html
    for word in ["团队", "介绍", "OIA", "Samcheok"]:
        count = html.count(word)
        print(f"Occurrences of '{word}': {count}")

if __name__ == "__main__":
    parse_html()
