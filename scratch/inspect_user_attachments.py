import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if i >= 5100:
            try:
                data = json.loads(line)
                if data.get("source") == "USER_EXPLICIT" and data.get("type") == "USER_INPUT":
                    print(f"=== Line {i}, Step {data.get('step_index')} ===")
                    # print keys to see what fields exist
                    print(f"Keys: {list(data.keys())}")
                    # print content
                    print(f"Content: {data.get('content')}")
                    # Check for other keys like files, images, attachments
                    for k in data:
                        if k not in ["content", "source", "type", "step_index", "status"]:
                            val_str = str(data[k])
                            print(f"{k}: {val_str[:300]}")
                    print("-" * 50)
            except Exception as e:
                pass
