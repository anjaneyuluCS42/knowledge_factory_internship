import jwt
import bcrypt
from datetime import datetime, timedelta, timezone

# 1. CONFIGURATION (Our Secret Keys for Encryption)
SECRET_KEY = "my_super_secret_multiplex_key_2026"
ALGORITHM = "HS256"

print("--- ⚙️ STEP 1: USER LOGGED IN (Framework Generates 2 Tokens) ---")

username = "anjan_dev"

# A. Creating Access Token (Short lifespan - 15 minutes)
access_payload = {
    "sub": username,
    "role": "user",
    "exp": datetime.now(timezone.utc) + timedelta(minutes=15) # 15 Mins Expiry
}
access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"[SUCCESS] Access Token Generated (Short-Term Pass):\n{access_token}\n")

# B. Creating Refresh Token (Long lifespan - 7 days)
refresh_payload = {
    "sub": username,
    "exp": datetime.now(timezone.utc) + timedelta(days=7) # 7 Days Expiry
}
refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"[SUCCESS] Refresh Token Generated (Long-Term Pass):\n{refresh_token}\n")


print("--- 🍿 STEP 2: MAKING API CALL (Requesting Data with Access Token) ---")

# When Frontend (React) sends the Access Token, the Framework decodes and verifies it
try:
    decoded_access = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"Token is VALID! Welcome, {decoded_access['sub']}. Your role is: {decoded_access['role']}")
except jwt.ExpiredSignatureError:
    print("Error: Access Token Expired!")
except jwt.PyJWTError:
    print("Error: Invalid Token!")


print("\n--- ⏱️ STEP 3: AFTER 15 MINUTES (When Access Token Expires) ---")

# We simulate an expired token by setting its time to 5 minutes in the past
expired_payload = {
    "sub": username,
    "exp": datetime.now(timezone.utc) - timedelta(minutes=5) # Already expired
}
expired_access_token = jwt.encode(expired_payload, SECRET_KEY, algorithm=ALGORITHM)

# If a user tries to request data using this expired token, the Framework rejects it:
try:
    jwt.decode(expired_access_token, SECRET_KEY, algorithms=[ALGORITHM])
except jwt.ExpiredSignatureError:
    print("🚨 [SERVER ALERT]: Access Token is DEAD! Access Denied.")


print("\n--- 🔄 STEP 4: THE SILENT EXCHANGE (Using Refresh Token to get a New Access Token) ---")
print("React JS sends the Refresh Token secretly to the Framework...")

# The Framework checks if the Refresh Token is still valid
try:
    decoded_refresh = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"[SERVER]: Refresh Token is PERFECT! User: {decoded_refresh['sub']}")
    
    # Since Refresh Token is valid, the Framework generates a brand new Access Token 👇
    new_access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
    print(f"✨ [NEW ACCESS TOKEN GENERATED]:\n{new_access_token}")
except jwt.PyJWTError:
    print("Refresh Token is also Invalid! Please Login Again.")
