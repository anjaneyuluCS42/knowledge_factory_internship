import json
data = '{"name": "Ravi", "age": 25}'
user = json.loads(data) # String నుండి Dictionary కి
print(user["name"])