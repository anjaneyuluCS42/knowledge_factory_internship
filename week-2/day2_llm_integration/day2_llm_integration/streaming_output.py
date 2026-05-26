from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

# Streaming response
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Tell me about Machine Learning."
        }
    ],
    stream=True
)

print("\nStreaming Response:\n")

# Print chunks one by one
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")