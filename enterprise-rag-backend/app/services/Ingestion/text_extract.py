from PyPDF2 import PdfReader

async def extract_text(file_path: str) -> str:
    reader = PdfReader(file_path)
    extracted_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    return extracted_text
