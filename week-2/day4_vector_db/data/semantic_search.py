from sentence_transformers import SentenceTransformer
import numpy as np

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Documents
documents = [
    "Python is used for AI applications.",
    "MongoDB is a NoSQL database.",
    "Semantic search improves retrieval.",
    "Vector databases store embeddings."
]

# Generate embeddings
doc_embeddings = model.encode(documents)

# User query
query = "How do vector databases work?"

query_embedding = model.encode([query])

# Similarity calculation
similarities = np.dot(doc_embeddings, query_embedding.T).flatten()

# Best match
best_match = np.argmax(similarities)

print("Best Match:")
print(documents[best_match])