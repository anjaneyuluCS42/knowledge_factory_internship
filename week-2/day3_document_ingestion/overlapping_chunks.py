from pypdf import PdfReader

# Load PDF
reader = PdfReader("sample.pdf")

text = ""

for page in reader.pages:
    extracted = page.extract_text()

    if extracted:
        text += extracted

# Chunk settings
chunk_size = 500
overlap = 100

chunks = []

start = 0

while start < len(text):
    end = start + chunk_size
    chunk = text[start:end]

    chunks.append(chunk)

    start += chunk_size - overlap

# Print chunks
print("\n===== Overlapping Chunks =====\n")

for index, chunk in enumerate(chunks):
    print(f"\n--- Chunk {index + 1} ---\n")
    print(chunk)

# Save chunks
with open("overlapping_chunks.txt", "w", encoding="utf-8") as file:
    for index, chunk in enumerate(chunks):
        file.write(f"\n--- Chunk {index + 1} ---\n")
        file.write(chunk)
        file.write("\n")

print("\nOverlapping chunks saved successfully.")