import asyncio
from fastapi import APIRouter, Request
from pydantic import BaseModel
from datetime import datetime
from fastapi import HTTPException
from dotenv import load_dotenv
from app.services.Retrieval.agno import agent
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator

load_dotenv()

router = APIRouter()


class Message(BaseModel):
    id: int
    type: str
    content: str
    timestamp: datetime

# Retrieve the agent's response from Qdrant and get back the response from LLM

# @router.post("/api/chat")
# async def chat_with_rag(request: Request, msg: Message):
#     try:
#         # Generate embedding
#         query_embedding = request.app.state.embedder.generate_query_embedding(msg.content)

#         # Query vector store with metadata filter
#         vector_store = request.app.state.vector_store
#         search_results = vector_store.search_similar(query_embedding, limit=3)
#         if not search_results:
#             pass
#         # Extract metadata filters using Agno
#         context_chunks = [r.payload["text"] for r in search_results]
#         context = "\n\n".join(context_chunks)

#         enhanced_prompt = f"""
#         Context from enterprise documents:
#         {context}

#         User question: {msg.content}

#         Please answer the question based on the provided context.
#         """
        
#         response = request.app.state.genai_model.generate_content(enhanced_prompt)

#         return {"response": response.text, "sources": [r.payload.get("title") for r in search_results]}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
@router.post("/api/chat")
async def chat_with_rag(msg: Message):
    try:
        async def agno_stream() -> AsyncGenerator[str, None]:
            # Use stream=True to get RunResponseEvent objects
            response_stream = agent.run(msg.content, stream=True)
            
            for event in response_stream:
                if event.event == "RunResponseContent":
                    yield event.content + "\n"

        return StreamingResponse(
            agno_stream(),
            media_type="text/plain",
            headers={"Cache-Control": "no-cache"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    