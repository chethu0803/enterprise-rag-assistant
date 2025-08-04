import os
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from typing import List, Optional, Dict, Any
from qdrant_client.models import Filter, FieldCondition, MatchValue
from qdrant_client.models import PointStruct
import uuid
from dotenv import load_dotenv

load_dotenv()
client = QdrantClient(url="https://4291a5ea-d0ef-4397-89ca-692524d03155.us-east4-0.gcp.cloud.qdrant.io:6333", api_key=os.getenv("QDRANT_API_KEY"))

class VectorStore:
    def __init__(self):
        self.client = client
        self.collection_name = "enterprise_docs"
        self.vector_size = 384 

    def create_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )

    def upsert_vectors(self, chunks: List[str], embeddings: List[List[float]], 
                      metadata: dict = None):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )
        points = [
            PointStruct(
                id=str(uuid.uuid4()),  
                vector=embedding,
                payload={
                    "text": chunk,
                    "metadata": metadata or {},
                    "chunk_index": idx
                }
            )
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]
        
        self.client.upsert(collection_name=self.collection_name, points=points)
        return len(points)

    def search_similar(self, query_embedding: List[float], limit: int = 5):
        collection_name = self.collection_name
        
        results = self.client.search(
            collection_name=collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        return results
    
    def search_with_filters(
        self,
        query_embedding: List[float],
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 5
    ):
        conditions = []

        if filters:
            for key, val in filters.items():
                if isinstance(val, list):
                    for item in val:
                        conditions.append(FieldCondition(key=key, match=MatchValue(value=item)))
                else:
                    conditions.append(FieldCondition(key=key, match=MatchValue(value=val)))

        q_filter = Filter(must=conditions) if conditions else None

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit,
            query_filter=q_filter
        )

        return results
