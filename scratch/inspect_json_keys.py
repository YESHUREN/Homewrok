import json
import os

def inspect_json():
    filename = "scratch/collection_rows.json"
    if not os.path.exists(filename):
        print(f"File {filename} does not exist.")
        return
        
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"Type of data: {type(data)}")
    if isinstance(data, dict):
        print(f"Keys: {list(data.keys())[:10]}")
        # Print a sample of some keys
        for k in list(data.keys())[:5]:
            v = data[k]
            print(f"  Key: {k}, Type: {type(v)}")
            if isinstance(v, dict):
                print(f"    Subkeys: {list(v.keys())[:5]}")
            elif isinstance(v, list):
                print(f"    Length: {len(v)}")
                if len(v) > 0:
                    print(f"    First item type: {type(v[0])}")
                    print(f"    First item sample: {str(v[0])[:200]}")
    elif isinstance(data, list):
        print(f"Length of list: {len(data)}")
        if len(data) > 0:
            print(f"First item type: {type(data[0])}")
            print(f"First item keys: {list(data[0].keys()) if isinstance(data[0], dict) else 'none'}")
            print(f"First item sample: {str(data[0])[:500]}")

if __name__ == "__main__":
    inspect_json()
