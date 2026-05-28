from sentence_transformers import SentenceTransformer
import numpy as np

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Knowledge base
documents = [
    "Artificial Intelligence enables smart systems.",
    "Embeddings convert text into vectors.",
    "FAISS performs fast similarity search.",
    "ChromaDB stores vectors efficiently."
]

# Create embeddings
doc_embeddings = model.encode(documents)

# Retrieval function
def retrieve(query, top_k=2):

    query_embedding = model.encode([query])

    similarities = np.dot(doc_embeddings, query_embedding.T).flatten()

    top_indices = similarities.argsort()[-top_k:][::-1]

    return [documents[i] for i in top_indices]

# Query
query = "What are embeddings?"

results = retrieve(query)

print("\nRetrieved Documents:")
for r in results:
    print("-", r)