import os
from dotenv import load_dotenv
from ollama import Client

load_dotenv()

api_key = os.getenv("OLLAMA_API_KEY")

client = Client(
    host="https://ollama.com",
    headers={
        "Authorization": f"Bearer {api_key}"
    }
)


def ask_ai(country_name):

    prompt = f"""
Generate important information about {country_name}.

STRICT FORMAT:

GDP Ranking: value

Male Population Percentage: value

Female Population Percentage: value

Most Popular Language: value

Literacy Rate: value

Ruling political party: value


National Sport: value

IMPORTANT:
- Each item MUST come in new line
- No paragraph
- No markdown
- No stars
- No extra explanation
"""

    try:

        response = client.chat(
            model="gpt-oss:120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]

    except Exception as e:

        return f"Error: {e}"