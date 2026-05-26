import ollama

# Send request to local model
response = ollama.chat(
    model='llama3',
    messages=[
        {
            'role': 'user',
            'content': 'Explain Artificial Intelligence in simple words'
        }
    ]
)

# Print response
print("\nAI Response:\n")
print(response['message']['content'])