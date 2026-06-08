


import bcrypt  

print("--- 🔐 STEP 1: USER REGISTRATION (to hash password) ---")

# user created plain password (Plain Text)
user_password = "Anji@2026"
print(f"Original Password: {user_password}")

# Rule: we need to give passsword in bytes to bcrypt then only it convrtsso we use .encode()
password_in_bytes = user_password.encode('utf-8') # utf-8 convers alphabets into numbrs

# gensalt() this is like a key. hashpw() it uses to lock password.
hashed_bytes = bcrypt.hashpw(password_in_bytes, bcrypt.gensalt())

# in database num will be stored into string by using this decode
hashed_string = hashed_bytes.decode('utf-8')
print(f"Hashed Password (Database lo save ayyedhi):\n{hashed_string}\n")


print("--- 🔑 STEP 2: USER LOGIN VERIFICATION (to check password) ---")

# Scenario A: 
entered_password_correct = "MySecurePassword@2026"

# checkpw() 
is_correct = bcrypt.checkpw(entered_password_correct.encode('utf-8'), hashed_string.encode('utf-8'))
print(f"User entered: '{entered_password_correct}' -> Login Success? {is_correct}")

# Scenario B: 
entered_password_wrong = "WrongPassword123"
is_wrong = bcrypt.checkpw(entered_password_wrong.encode('utf-8'), hashed_string.encode('utf-8'))
print(f"User entered: '{entered_password_wrong}' -> Login Success? {is_wrong}")

