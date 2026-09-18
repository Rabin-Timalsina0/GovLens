from fastapi import APIRouter
from app.services.retrieval import retrieve_relevant_chunks

router = APIRouter()

@router.get("/")
def global_search(q: str):
    # Reuse retrieval logic but without LLM generation
    chunks = retrieve_relevant_chunks(q, top_k=10)
    return {"results": chunks}
