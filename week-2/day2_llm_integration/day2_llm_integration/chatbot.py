from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

print("========== AI CHATBOT ==========")
print("Type 'exit' to stop chatbot\n")

# Store conversation history
messages = [
    {
        "role": "system",
        "content": "You are a friendly AI assistant."
    }
]

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Chatbot stopped.")
        break

    # Add user message
    messages.append(
        {
            "role": "user",
            "content": user_input
        }
    )

    # Generate AI response
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    reply = response.choices[0].message.content

    print("\nAI:", reply, "\n")

    # Store AI response
    messages.append(
        {
            "role": "assistant",
            "content": reply
        }
    )