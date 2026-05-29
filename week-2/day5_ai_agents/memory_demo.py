print("=== MEMORY DEMO ===")

memory = []

while True:
    message = input("You: ")

    if message.lower() == "exit":
        break

    memory.append(message)

    print("\nMemory Stored:")
    print(memory)