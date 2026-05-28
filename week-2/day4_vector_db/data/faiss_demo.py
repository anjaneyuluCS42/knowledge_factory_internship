import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Documents
documents = [
    "Artificial Intelligence is transforming the world.",
    "Machine Learning is a subset of AI.",
    "Semantic search understands meaning.",
    "Vector databases store embeddings."
]

# Create embeddings
embeddings = model.encode(documents)

# Convert to float32
embeddings = np.array(embeddings).astype('float32')

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)

# Add embeddings
index.add(embeddings)

print("Embeddings stored in FAISS!")

# Query
query = "Explain semantic search"

query_vector = model.encode([query]).astype('float32')

# Search
k = 2
distances, indices = index.search(query_vector, k)

print("\nTop Matches:")
for idx in indices[0]:
    print(documents[idx])