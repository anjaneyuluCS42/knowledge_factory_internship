
# ===================GET METHOD===================
import requests
print("\n========== GET METHOD ==========\n")

print("GET → Used to retrieve data from server\n")

get_response = requests.get(
    "https://jsonplaceholder.typicode.com/users"
)

print("GET Status Code:", get_response.status_code)

users = get_response.json()

print("\nFirst User Details:\n")

print("Name:", users[0]["name"])
print("Email:", users[0]["email"])
print("City:", users[0]["address"]["city"])

# ==========================================
# POST METHOD
# ==========================================

print("\n========== POST METHOD ==========\n")

print("POST → Used to create/send data\n")

post_data = {

    "title": "Internship Learning",

    "body": "Learning APIs using Python",

    "userId": 1

}

post_response = requests.post(

    "https://jsonplaceholder.typicode.com/posts",

    json=post_data

)

print("POST Status Code:", post_response.status_code)

print("POST Response:\n")

print(post_response.json())

# ==========================================
# PUT METHOD
# ==========================================

print("\n========== PUT METHOD ==========\n")

print("PUT → Used to completely update data\n")

put_data = {

    "id": 1,

    "title": "Updated Internship Title",

    "body": "Updated API Content",

    "userId": 1

}

put_response = requests.put(

    "https://jsonplaceholder.typicode.com/posts/1",

    json=put_data

)

print("PUT Status Code:", put_response.status_code)

print("PUT Response:\n")

print(put_response.json())

# ==========================================
# PATCH METHOD
# ==========================================

print("\n========== PATCH METHOD ==========\n")

print("PATCH → Used to partially update data\n")

patch_data = {

    "title": "Partially Updated Title"

}

patch_response = requests.patch(

    "https://jsonplaceholder.typicode.com/posts/1",

    json=patch_data

)

print("PATCH Status Code:", patch_response.status_code)

print("PATCH Response:\n")

print(patch_response.json())

# ==========================================
# DELETE METHOD
# ==========================================

print("\n========== DELETE METHOD ==========\n")

print("DELETE → Used to remove data\n")

delete_response = requests.delete(

    "https://jsonplaceholder.typicode.com/posts/1"

)

print("DELETE Status Code:", delete_response.status_code)

print("Data Deleted Successfully")
