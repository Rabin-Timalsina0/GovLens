from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    document_id: str
    status: str
    message: str

class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    document_type: Optional[str] = None
    issuing_organization: Optional[str] = None
    language: Optional[str] = "en"
    page_count: Optional[int] = None

class Document(DocumentBase):
    id: str
    file_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

class ChunkMetadata(BaseModel):
    document_id: str
    chunk_index: int
    page_number: int
    section_title: Optional[str] = None
    content: str
