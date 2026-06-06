log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

import json

with open(log_file, "r", encoding="utf-8") as f:
    for line in f:
        if "31039f9906f58024b826d31ca6a9c599" in line:
            data = json.loads(line)
            step = data.get("step_index")
            type_ = data.get("type")
            source = data.get("source")
            content = data.get("content", "")
            # Print type and a tiny bit of content
            print(f"Step {step} ({type_}) by {source}: {content[:100]}...")
