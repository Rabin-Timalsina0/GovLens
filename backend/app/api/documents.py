from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from typing import List
import uuid
from datetime import datetime
from app.db.supabase import get_supabase_client
from app.services.ingestion import process_document
from app.models.documents import DocumentUploadResponse, Document

router = APIRouter()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    document_id = str(uuid.uuid4())
    file_bytes = await file.read()
    
    supabase = get_supabase_client()
    
    # Store document record in Supabase
    doc_data = {
        "id": document_id,
        "title": file.filename,
        "file_name": file.filename,
        "status": "uploading",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    try:
        supabase.table("documents").insert(doc_data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create document record: {str(e)}")
        
    background_tasks.add_task(process_document, file_bytes, file.filename, document_id)
    
    return DocumentUploadResponse(
        document_id=document_id,
        status="uploading",
        message="Document is uploading and will be processed in the background."
    )

@router.get("/", response_model=List[dict])
def get_documents():
    supabase = get_supabase_client()
    response = supabase.table("documents").select("*").order("created_at", desc=True).execute()
    return response.data

@router.get("/{document_id}")
def get_document(document_id: str):
    supabase = get_supabase_client()
    response = supabase.table("documents").select("*").eq("id", document_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Document not found")
    return response.data[0]

@router.delete("/{document_id}")
def delete_document(document_id: str):
    supabase = get_supabase_client()
    supabase.table("documents").delete().eq("id", document_id).execute()
    # TODO: Delete from Qdrant as well
    return {"status": "deleted"}
