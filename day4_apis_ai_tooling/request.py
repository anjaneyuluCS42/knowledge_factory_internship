import requests

url = "https://jsonplaceholder.typicode.com/users"

anji = requests.get(url)

print("Status Code:", anji.status_code)

data = anji.json()

for user in data[:1]:

    print("Name:", user["name"])

    print("Email:", user["email"])
    print("Address:", user["address"])

    print("-------------------")