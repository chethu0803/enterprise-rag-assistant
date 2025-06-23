from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv()


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


app = FastAPI()

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


@app.post("/api/chat")
async def receive_message(msg:Message):
    response = model.generate_content(msg.content)
    return {"response": f"{response.text}"}