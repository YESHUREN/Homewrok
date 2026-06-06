import json
import os

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

search_terms = ["31039f9906f58024b826d31ca6a9c599", "kcloud_update1", "copy_kcloud_images_correct"]

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "")
            tc_str = str(data.get("tool_calls", []))
            
            match = False
            for term in search_terms:
                if term in content or term in tc_str:
                    match = True
            
            if match:
                print(f"=== Line {i}, Step {data.get('step_index')} (Source: {data.get('source')}, Type: {data.get('type')}) ===")
                if content:
                    print(f"Content: {content[:400]}")
                if tc_str != "[]":
                    print(f"Tool: {tc_str[:400]}")
                print("-" * 60)
        except Exception as e:
            pass
