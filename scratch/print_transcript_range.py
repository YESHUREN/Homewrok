import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if 5550 <= i <= 5760:
            try:
                data = json.loads(line)
                content = data.get("content", "")
                tool_calls = data.get("tool_calls", [])
                
                print(f"--- Line {i}, Step {data.get('step_index')} (Source: {data.get('source')}, Type: {data.get('type')}) ---")
                if content:
                    print(f"Content: {content[:300]}")
                if tool_calls:
                    print(f"Tool calls: {json.dumps(tool_calls)[:300]}")
                print("-" * 50)
            except Exception as e:
                pass
