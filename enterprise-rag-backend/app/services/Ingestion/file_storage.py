import os
from fastapi import UploadFile
import uuid

async def save_file(file: UploadFile) -> str:
    upload_dir = "./uploadedFiles"
    os.makedirs(upload_dir, exist_ok=True)  

    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(upload_dir, filename)

    with open(path, "wb") as out_file:
        out_file.write(await file.read())

    return path
