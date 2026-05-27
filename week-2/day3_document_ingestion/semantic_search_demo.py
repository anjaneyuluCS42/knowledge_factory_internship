from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Sample chunks
documents = [
    "Artificial Intelligence is transforming industries.",
    "Machine Learning is a subset of AI.",
    "Deep Learning uses neural networks.",
    "Python is widely used in AI applications."
]

# User query
query = "What is AI?"

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Convert documents into embeddings
doc_embeddings = model.encode(documents)

# Convert query into embedding
query_embedding = model.encode([query])

# Calculate similarity
similarities = cosine_similarity(query_embedding, doc_embeddings)

# Find best match
best_match_index = np.argmax(similarities)

# Print results
print("\n===== Semantic Search Result =====\n")

print("User Query:")
print(query)

print("\nMost Relevant Document:")
print(documents[best_match_index])

print("\nSimilarity Score:")
print(similarities[0][best_match_index])