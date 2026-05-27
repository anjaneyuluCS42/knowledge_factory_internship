from pypdf import PdfReader

try:
    # Open PDF
    reader = PdfReader("sample.pdf")

    text = ""

    # Read pages safely
    for index, page in enumerate(reader.pages):

        try:
            extracted = page.extract_text()

            if extracted:
                text += extracted
            else:
                print(f"Page {index + 1} contains no readable text (possibly image-based).")

        except Exception as page_error:
            print(f"Error reading page {index + 1}: {page_error}")

    # Check extracted text
    if text.strip() == "":
        print("\nNo text found in PDF.")
    else:
        print("\n===== Extracted Text =====\n")
        print(text)

        # Save text
        with open("extracted_text.txt", "w", encoding="utf-8") as file:
            file.write(text)

        print("\nText saved successfully.")

except FileNotFoundError:
    print("PDF file not found.")

except Exception as error:
    print(f"An error occurred: {error}")