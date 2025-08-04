from fastapi import APIRouter, UploadFile, File, Request, Depends, Form
from app.models.user import User
from app.services.Auth.auth import admin_required
from app.services.Ingestion import file_storage, text_extract, chunker, embedder
from datetime import datetime
from app.services.Ingestion.vector_store import VectorStore
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document

router = APIRouter()
vector_store = VectorStore()

@router.post("/ingest")
async def ingest_document(
    request:Request,
    file: UploadFile = File(...), 
    title: str = Form(...),
    author: str = Form(...),
    tags: str = Form(None),
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db)
    ):
    # 1. Save file
    file_path = await file_storage.save_file(file)
    
    # 2. Store document metadata in DB
    document = Document(
        title=title,
        author=author,
        tags=[t.strip() for t in tags.split(",")] if tags else [],
        file_path=file_path,
        uploaded_by=current_user.email  
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # 3. Extract text
    text = await text_extract.extract_text(file_path)

    # 4. Chunk
    chunks = chunker.chunk_text(text)

    # 5. Embed
    embeddings = await embedder.generate_embeddings(chunks)

    # 6. Upsert to Vector DB
    vector_store = request.app.state.vector_store
    chunks_created = vector_store.upsert_vectors(
            chunks=chunks,
            embeddings=embeddings,
            metadata={
            "filename": file.filename,
            "upload_timestamp": datetime.now().isoformat(),
            "doc_id": str(document.id),
            "title": title,
            "author": author,
            "tags": document.tags,
            }
        )
        
    return {"message": "Document ingested successfully","chunks_created": chunks_created, "chunks": chunks}
