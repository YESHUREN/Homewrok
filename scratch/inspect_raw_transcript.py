log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "media__" in line:
            # print first 200 chars and length of matches
            print(f"Line {i} contains media__: {line[:150]}... length={len(line)}")
