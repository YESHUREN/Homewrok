import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            if data.get("source") == "USER_EXPLICIT" and data.get("type") == "USER_INPUT":
                print(f"=== Line {i}, Step {data.get('step_index')} ===")
                print(f"Content: {data.get('content')}")
                # check if there is any other info in data
                # like attachments
                print("-" * 50)
        except Exception as e:
            pass
