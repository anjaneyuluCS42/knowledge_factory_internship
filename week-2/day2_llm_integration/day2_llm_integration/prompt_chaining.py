from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

# STEP 1 - Generate project idea
idea_response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Give me one beginner AI project idea."
        }
    ]
)

project_idea = idea_response.choices[0].message.content

print("\nGenerated Project Idea:\n")
print(project_idea)

# STEP 2 - Explain the project
detail_response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": f"Explain this project in detail: {project_idea}"
        }
    ]
)

print("\nDetailed Explanation:\n")
print(detail_response.choices[0].message.content)