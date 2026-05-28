import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Create ChromaDB client
client = chromadb.Client()

# Create collection
collection = client.create_collection(name="ai_notes")

# Documents
documents = [
    "Artificial Intelligence is transforming the world.",
    "Machine Learning is a subset of AI.",
    "Semantic search understands meaning.",
    "Vector databases store embeddings."
]

# Convert text into embeddings
embeddings = model.encode(documents).tolist()

# Store embeddings
for i, doc in enumerate(documents):
    collection.add(
        ids=[str(i)],
        documents=[doc],
        embeddings=[embeddings[i]]
    )

print("Documents stored successfully!")

# Query
query = "What is semantic search?"

query_embedding = model.encode([query]).tolist()

results = collection.query(
    query_embeddings=query_embedding,
    n_results=2
)

print("\nTop Results:")
for result in results['documents'][0]:
    print(result)