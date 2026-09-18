from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from app.models.chat import ChatRequest, ChatResponse, Citation
from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import generate_answer
from app.db.supabase import get_supabase_client

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def chat_with_documents(request: ChatRequest):
    conversation_id = request.conversation_id
    supabase = get_supabase_client()
    
    if not conversation_id:
        # Create new conversation
        conversation_id = str(uuid.uuid4())
        try:
            supabase.table("conversations").insert({"id": conversation_id}).execute()
        except Exception:
            pass # ignore for MVP if it fails
            
    # Save user message
    try:
        supabase.table("messages").insert({
            "conversation_id": conversation_id,
            "role": "user",
            "content": request.message
        }).execute()
    except Exception:
        pass
    
    # 1. Retrieve
    chunks = retrieve_relevant_chunks(request.message, request.document_ids)
    
    if not chunks:
        return ChatResponse(
            conversation_id=conversation_id,
            answer="I couldn't find any relevant documents to answer this question.",
            citations=[],
            evidence_level="insufficient",
            insufficient_information=True
        )
        
    # 2. Generate Answer
    llm_response = generate_answer(request.message, chunks)
    
    # 3. Validate citations against retrieved chunks
    valid_citations = []
    retrieved_chunk_ids = {c["chunk_id"] for c in chunks}
    for cit in llm_response.get("citations", []):
        if cit.get("chunk_id") in retrieved_chunk_ids:
            valid_citations.append(Citation(**cit))
            
    answer_text = llm_response.get("answer", "Error generating answer.")
    
    # Save assistant message
    try:
        msg_res = supabase.table("messages").insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": answer_text
        }).execute()
        
        # Save citations
        if msg_res.data and valid_citations:
            message_id = msg_res.data[0]["id"]
            citation_records = [{
                "message_id": message_id,
                "document_id": c.document_id,
                "chunk_id": c.chunk_id,
                "page_number": c.page_number,
                "reason": c.reason
            } for c in valid_citations]
            supabase.table("message_citations").insert(citation_records).execute()
    except Exception as e:
        print(f"Error saving message: {e}")
        
    return ChatResponse(
        conversation_id=conversation_id,
        answer=answer_text,
        citations=valid_citations,
        evidence_level=llm_response.get("evidence_level", "insufficient"),
        insufficient_information=llm_response.get("insufficient_information", True)
    )
