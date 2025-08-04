from sentence_transformers import SentenceTransformer
from typing import List
model = SentenceTransformer("intfloat/e5-small-v2")

def generate_query_embedding(query: str) -> List[float]:
    """
    Generate embedding for search query
    """
    instruction = "query: "
    embedding = model.encode([instruction + query], convert_to_tensor=False)[0].tolist()
    return embedding