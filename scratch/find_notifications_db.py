with open('supabase_schema.sql', 'r', encoding='utf-8') as f:
    schema = f.read()

if 'notification' in schema.lower():
    print("Found mention of notifications in schema:")
    lines = schema.split('\n')
    for i, line in enumerate(lines):
        if 'notification' in line.lower():
            print(f"Line {i+1}: {line}")
else:
    print("No notifications in supabase_schema.sql")
