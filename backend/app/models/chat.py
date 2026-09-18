from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    document_ids: Optional[List[str]] = []

class Citation(BaseModel):
    chunk_id: str
    page_number: int
    document_id: str
    reason: str

class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    citations: List[Citation]
    evidence_level: str
    insufficient_information: bool
