import re

with open('supabase_schema.sql', 'r', encoding='utf-8') as f:
    schema = f.read()

tables = re.findall(r'(?i)CREATE TABLE\s+(?:public\.)?(\w+)', schema)
print("Tables in schema:")
for t in tables:
    print(t)
