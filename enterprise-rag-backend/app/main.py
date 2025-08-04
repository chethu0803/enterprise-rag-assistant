from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
from app.routes.ingest import router as ingest
from app.routes.chat_with_rag import router as chat_router
from contextlib import asynccontextmanager
from app.services.Ingestion.vector_store import VectorStore
from app.services.Auth import auth
import asyncio
from agno.agent import Agent
from agno.agent import Agent
from agno.knowledge.pdf import PDFKnowledgeBase, PDFReader
from agno.vectordb.qdrant import Qdrant

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

COLLECTION_NAME = "pdf-reader"

vector_db = Qdrant(collection=COLLECTION_NAME, url="https://4291a5ea-d0ef-4397-89ca-692524d03155.us-east4-0.gcp.cloud.qdrant.io:6333", api_key=os.getenv("QDRANT_API_KEY"))

# Create a knowledge base with the PDFs from the data/pdfs directory
knowledge_base = PDFKnowledgeBase(
    path="data/pdf",
    vector_db=vector_db,
    reader=PDFReader(chunk=True),
)

# Create an agent with the knowledge base
agent = Agent(
    knowledge=knowledge_base,
    search_knowledge=True,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vector_store = VectorStore()
    app.state.genai_model = model
    yield

app = FastAPI(lifespan=lifespan)

# Allow CORS so frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define message model
class Message(BaseModel):
    id: int
    type: str
    content: str
    timestamp: datetime



app.include_router(ingest)
app.include_router(chat_router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])

if __name__ == "__main__":
    # Comment out after first run
    asyncio.run(knowledge_base.aload(recreate=False))
