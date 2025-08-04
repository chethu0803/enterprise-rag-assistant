
from sqlalchemy import Column, String, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    tags = Column(ARRAY(String))
    uploaded_by = Column(String)  # Or UUID if you use user table
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    file_path = Column(String, nullable=False)
