import json
import os

def search_fallback():
    if not os.path.exists("fallback_db.json"):
        print("fallback_db.json does not exist")
        return
        
    with open("fallback_db.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    data_str = json.dumps(data, ensure_ascii=False)
    
    for word in ["江原", "三陟", "KNU", "Samcheok"]:
        count = data_str.count(word)
        print(f"Word '{word}' count: {count}")

if __name__ == "__main__":
    search_fallback()
