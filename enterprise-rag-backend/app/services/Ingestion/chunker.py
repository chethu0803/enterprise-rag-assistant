from typing import List

def chunk_text(text: str, max_tokens: int = 500) -> List[str]:
    """
    Chunk text into smaller segments with optional overlap
    """
    paragraphs = text.split("\n\n")
    chunks = []
    current = ""
    
    for para in paragraphs:
        # Simple token estimation (rough approximation)
        estimated_tokens = len(current.split()) + len(para.split())
        
        if estimated_tokens < max_tokens:
            current += para + "\n\n"
        else:
            if current.strip():
                chunks.append(current.strip())
            current = para + "\n\n"
    
    if current.strip():
        chunks.append(current.strip())
    return chunks
