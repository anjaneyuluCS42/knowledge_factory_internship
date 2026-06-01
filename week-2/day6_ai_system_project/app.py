from flask import Flask, request, render_template
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from groq import Groq
import faiss
import numpy as np
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# GROQ Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Read PDF
reader = PdfReader("sample.pdf")

text = ""

for page in reader.pages:
    extracted_text = page.extract_text()

    if extracted_text:
        text += extracted_text

# Chunking
chunks = text.split("\n")

# Embedding Model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Create Embeddings
embeddings = model.encode(chunks)

# FAISS Vector Database
dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(np.array(embeddings))

# Home Route
@app.route("/", methods=["GET", "POST"])
def home():

    answer = ""

    if request.method == "POST":

        query = request.form["query"]

        # Query Embedding
        query_embedding = model.encode([query])

        # Similarity Search
        D, I = index.search(
            np.array(query_embedding),
            k=3
        )

        context = ""

        for i in I[0]:
            context += chunks[i] + "\n"

        # GROQ Response
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": f"Answer using this context:\n{context}"
                },
                {
                    "role": "user",
                    "content": query
                }
            ]
        )

        answer = response.choices[0].message.content

    return render_template(
        "index.html",
        answer=answer
    )

# Run App
if __name__ == "__main__":
    app.run(debug=True)