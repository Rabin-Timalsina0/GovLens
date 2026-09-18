import fitz
import io
from typing import List, Dict, Any
from app.models.documents import ChunkMetadata

def extract_text_and_chunk(file_bytes: bytes, document_id: str, chunk_size: int = 1000, overlap: int = 150) -> List[ChunkMetadata]:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    chunks = []
    chunk_index = 0
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        if not text.strip():
            continue
            
        # Basic chunking: split by words
        words = text.split()
        
        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunk_text = " ".join(words[start:end])
            
            chunks.append(ChunkMetadata(
                document_id=document_id,
                chunk_index=chunk_index,
                page_number=page_num + 1,  # 1-indexed
                section_title=None, # Heading detection can be complex, skip for MVP
                content=chunk_text
            ))
            
            chunk_index += 1
            start += (chunk_size - overlap)
            
    return chunks
