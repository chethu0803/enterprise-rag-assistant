from agno.agent import Agent
from qdrant_client import QdrantClient
import os
from agno.models.google import Gemini
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from typing import List, Dict, Tuple, Optional
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from typing import List
from agno.models.google import Gemini

model = SentenceTransformer("intfloat/e5-small-v2")

class Document:
    def __init__(
        self,
        content: str,
        name: Optional[str] = None,
        id: Optional[str] = None,
        metadata: Optional[Dict] = None,
    ):
        if not content:
            raise ValueError("Document must have non-empty 'content'.")
        
        self.content = content
        self.name = name or "Unnamed Document"
        self.id = id
        self.metadata = metadata or {}

    def __repr__(self):
        return f"Document(id={self.id}, name={self.name})"
    
    def to_dict(self):
        return {
            "content": self.content,
            "metadata": self.metadata
        }


class QdrantKnowledgeWrapper:
    def __init__(self, vector_db: QdrantClient, collection_name: str, metadata_fields: List[str], num_documents: int = 5):
        self.vector_db = vector_db
        self.collection_name = collection_name
        self.metadata_fields = metadata_fields 
        self.num_documents = num_documents
        self.model = SentenceTransformer("intfloat/e5-small-v2")

    def _encode_query(self, query: str):
        instruction = "passage: "
        inputs = [instruction + query]
        embeddings = self.model.encode(inputs, convert_to_tensor=False).tolist()
        return embeddings[0]

    def search(self, query: str, **kwargs) -> List[Document]:
        limit   = kwargs.get("num_documents", self.num_documents)
        filters = kwargs.get("filters", {})


        try:
            qdrant_filter = self._build_qdrant_filter(filters)
            results = self.vector_db.search(
                collection_name=self.collection_name,
                query_vector   = self._encode_query(query),
                limit          = limit,
                with_payload   = True,
                with_vectors   = False,
                query_filter   = qdrant_filter
            )
        except Exception as e:
            print(f"[ERROR] Qdrant search failed: {e}")
            results = []

        if not results and ("file" in query.lower() or query.lower().endswith(".pdf")):
            filename = query.strip()
            if not filename.lower().endswith(".pdf"):
                filename += ".pdf"
            md_filter = Filter(
                must=[FieldCondition(key="filename", match=MatchValue(value=filename))]
            )
            try:
                results = self.vector_db.scroll(
                    collection_name=self.collection_name,
                    filter=qdrant_filter or md_filter,  # use either existing filters or this one
                    with_payload=True
                )
            except Exception as e:
                print(f"[ERROR] Qdrant metadata‐only scroll failed: {e}")
                results = []

        documents = []
        for point in results:
            try:
                payload = point.payload or {}

                content = (
                    payload.get("page_content")
                    or payload.get("text")
                    or payload.get("content")
                    or payload.get("document")
                    or ""
                )
                metadata = {key: payload.get(key) for key in self.metadata_fields if key in payload}
                metadata = {k: payload[k] for k in self.metadata_fields if k in payload}

                doc = Document(
                    content=content,
                  metadata=metadata
                )
                documents.append(doc)

            except Exception as e:
                print(f"[WARNING] Failed to process point: {e}")
                continue

        return documents

    def _build_qdrant_filter(self, filters: Dict):
        if not filters:
            return None

        conditions = []
        for key, value in filters.items():
            conditions.append(FieldCondition(
                key=key,  # No "metadata." prefix needed if your metadata is top-level
                match=MatchValue(value=value)
            ))

        return Filter(must=conditions)

    def validate_filters(self, filters: Optional[Dict] = None) -> Tuple[Dict, List[str]]:
        if not filters:
            return {}, []

        valid = {}
        invalid = []

        for k, v in filters.items():
            if k in self.metadata_fields:
                valid[k] = v
            else:
                invalid.append(k)

        return valid, invalid
    
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

knowledge = QdrantKnowledgeWrapper(
                vector_db=qdrant_client,
                collection_name="enterprise_docs",
                metadata_fields=["filename", "title", "author", "tags"],
            )

agent = Agent(
    model=Gemini(id="gemini-2.0-flash",api_key=os.getenv("GOOGLE_API_KEY")),
    name="Enterprise RAG Agent",
    knowledge=knowledge, 
    instructions="You are a helpful assistant. Search enterprise documents to answer user questions. If you don't know the answer, say 'I don't know'. Check if the query has metadata filters and use them to narrow down results. If the query is about a specific file, try to find that file in the vector store. There is a particular metadata feature in vector store where you can filter results based on metadata fields like 'filename', 'title', 'author', and 'tags'. The user might ask about a specific file or document, so you should be able to search by filename or other metadata. Always return the sources of the information used to answer the question. The user might point out that it is a document or file or image, ignore.",
    
)