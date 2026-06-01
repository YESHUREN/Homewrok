import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for fallbackPosts or let's search for how posts table is queried in `GET /api/posts`
print("=== GET /api/posts implementation ===")
lines = content.split('\n')
for idx, line in enumerate(lines):
    if 'app.get("/api/posts"' in line:
        for j in range(idx, idx + 80):
            print(f"{j+1}: {lines[j]}")
        break
