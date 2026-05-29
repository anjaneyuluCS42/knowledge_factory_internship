print("=== SIMPLE AI AGENT ===")

question = input("Ask something: ")

if "weather" in question:
    print("Agent is using Weather Tool...")

elif "calculate" in question:
    print("Agent is using Calculator Tool...")

elif "search" in question:
    print("Agent is using Search Tool...")
elif "technical" in question:
    print("Agent is using technical tools....")

else:
    print("Agent is using AI Reasoning...")