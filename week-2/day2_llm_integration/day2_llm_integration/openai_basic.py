from groq import Groq

# Initialize Groq client
client = Groq(
    api_key="YOUR_GROQ_API_KEY"
)

# Send request
response = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "user",
            "content": "Explain Python programming in simple words."
        }
    ],
    temperature=0.7
)

# Print response
print("\nAI Response:\n")
print(response.choices[0].message.content)