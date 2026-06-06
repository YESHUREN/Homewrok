import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

target_steps = range(5600, 5636)
with open(log_file, "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        step = data.get("step_index")
        if step in target_steps:
            print(f"--- STEP {step} ---")
            print(f"Source: {data.get('source')}")
            print(f"Type: {data.get('type')}")
            print(f"Thinking: {data.get('thinking', '')[:300]}...")
            print(f"Content: {data.get('content', '')[:300]}...")
            if "tool_calls" in data:
                print(f"Tool calls: {data['tool_calls']}")
            print("\n")
