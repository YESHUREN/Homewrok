import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        if data.get("type") == "USER_INPUT":
            step = data.get("step_index")
            content = data.get("content", "")
            # Check if there are any images in tool_calls or somewhere in data
            print(f"Step {step}: Content: {content[:150]}")
            # print keys of data to find where images are stored
            print(f"Keys: {list(data.keys())}")
            # Look for image lists
            for k, v in data.items():
                if "image" in k.lower() or "file" in k.lower() or k == "media":
                    print(f"  {k}: {v}")
            # Look inside content or metadata
            if "metadata" in data:
                print(f"  metadata: {list(data['metadata'].keys())}")
