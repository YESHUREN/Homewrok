import json

log_file = r"C:\Users\27916\.gemini\antigravity\brain\58f3b37f-1f90-48f4-a1f8-a9be0f1e5d30\.system_generated\logs\transcript.jsonl"

with open(log_file, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        try:
            data = json.loads(line)
            content = data.get("content", "")
            tc_str = str(data.get("tool_calls", []))
            
            # search for these specific media files
            target_medias = [
                "media__1780467149360", "media__1780467157386", "media__1780467170360", 
                "media__1780467485523", "media__1780467746910", "media__1780467782088", 
                "media__1780468049622", "media__1780468477847", "media__1780468530847", 
                "media__1780469017416", "media__1780469527845"
            ]
            
            match = False
            for tm in target_medias:
                if tm in content or tm in tc_str:
                    match = True
                    break
            
            if match:
                print(f"=== Line {i}, Step {data.get('step_index')} (Source: {data.get('source')}, Type: {data.get('type')}) ===")
                if content:
                    print(f"Content: {content[:800]}")
                if tc_str != "[]":
                    print(f"Tool: {tc_str[:800]}")
                print("-" * 60)
        except Exception as e:
            pass
