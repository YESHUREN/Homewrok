import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "")
            # We want to search for 31039f99 in content or tool calls
            found = False
            if "31039f99" in content:
                found = True
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                if "31039f99" in str(tc.get("arguments", "")):
                    found = True
            
            if found:
                print(f"--- Line {i}, Step {data.get('step_index')} (Source: {data.get('source')}, Type: {data.get('type')}) ---")
                print(content[:600])
                print("-" * 50)
        except Exception as e:
            pass
