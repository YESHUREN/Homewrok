import json
import os

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

if not os.path.exists(log_file):
    print("Transcript log file does not exist!")
    exit(1)

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            # Look for user messages or tool calls containing notion link or png names
            content = data.get("content", "")
            if "31039f99" in content or "K-Cloud" in content or "kcloud" in content.lower():
                print(f"--- Step {data.get('step_index', i)} (Source: {data.get('source')}) ---")
                print(content[:500])
                print()
            
            # Check tool_calls
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                args = str(tc.get("arguments", ""))
                if "kcloud" in args.lower() or "31039f99" in args:
                    print(f"--- Step {data.get('step_index', i)} Tool Call: {tc.get('name')} ---")
                    print(args[:500])
                    print()
        except Exception as e:
            pass
