import json
import re

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for line in f:
        matches = re.findall(r"media__\d+\.png", line)
        if matches:
            # Parse as json
            try:
                data = json.loads(line)
                step = data.get("step_index")
                type_ = data.get("type")
                source = data.get("source")
                content = data.get("content", "")
                if source == "USER_EXPLICIT" or type_ == "USER_INPUT":
                    print(f"Step {step} ({type_}): Content: {content[:100]}...")
                    print(f"  Images: {set(matches)}")
            except Exception as e:
                pass
