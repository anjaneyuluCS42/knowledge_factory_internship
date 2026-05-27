from pypdf import PdfReader

# Read PDF
reader = PdfReader("sample.pdf")

text = ""

for page in reader.pages:
    extracted = page.extract_text()

    if extracted:
        text += extracted

# Chunk settings
chunk_size = 500

# Create chunks
chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# Print chunks
print("\n===== Text Chunks =====\n")

for index, chunk in enumerate(chunks):
    print(f"\n--- Chunk {index + 1} ---\n")
    print(chunk)

# Save chunks
with open("chunks.txt", "w", encoding="utf-8") as file:
    for index, chunk in enumerate(chunks):
        file.write(f"\n--- Chunk {index + 1} ---\n")
        file.write(chunk)
        file.write("\n")

print("\nChunks saved into chunks.txt")