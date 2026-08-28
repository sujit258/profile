import pdfplumber
pdf_path = r"E:\Sujit_Joshi_Senior_Full_Stack_Engineer_Resume.pdf"
try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Number of pages: {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            print(f"Page {i+1} length: {len(text) if text else 0}")
            if text:
                print(f"First 200 chars: {text[:200]}")
except Exception as e:
    print(f"Error: {e}")
