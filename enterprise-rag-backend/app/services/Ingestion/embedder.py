from sentence_transformers import SentenceTransformer
from typing import List
# Load once (you can move this to a startup script)
model = SentenceTransformer("intfloat/e5-small-v2")

async def generate_embeddings(chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings for text chunks using E5 model
    """
    # E5 models work better with task instructions
    instruction = "passage: "
    inputs = [instruction + chunk for chunk in chunks]
    embeddings = model.encode(inputs, convert_to_tensor=False).tolist()
    return embeddings
