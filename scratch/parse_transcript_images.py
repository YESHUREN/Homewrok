import re

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

mentions = set()
with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        # find all instances of media__XXXX.png or similar
        matches = re.findall(r"media__\d+\.png", line)
        for m in matches:
            mentions.add((m, i))

# Sort by step/line index
for m, i in sorted(list(mentions), key=lambda x: x[1]):
    print(f"Line {i}: {m}")
