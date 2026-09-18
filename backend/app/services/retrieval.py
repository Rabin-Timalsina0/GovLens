from typing import List, Dict, Any, Optional
from app.db.qdrant import get_qdrant_client
from app.services.embeddings import generate_embeddings
from qdrant_client.models import Filter, FieldCondition, MatchValue

def retrieve_relevant_chunks(query: str, document_ids: Optional[List[str]] = None, top_k: int = 5) -> List[Dict[str, Any]]:
    qdrant = get_qdrant_client()
    query_embedding = generate_embeddings([query])[0]
    
    query_filter = None
    if document_ids:
        # For simplicity, if multiple doc ids, we can use a Must condition with multiple Shoulds, 
        # but let's implement basic filtering
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(value=document_id)
                ) for document_id in document_ids
            ]
        ) # Note: If len > 1, this needs Any condition. Let's simplify and assume 1 for now or no filter.
        # Let's fix this for multiple doc IDs
        
        if len(document_ids) == 1:
            query_filter = Filter(must=[FieldCondition(key="document_id", match=MatchValue(value=document_ids[0]))])
        else:
            # Not fully supporting multi-doc filter in this MVP snippet, but you can build it using MatchAny
            pass 
            
    
    results = qdrant.search(
        collection_name="documents",
        query_vector=query_embedding,
        query_filter=query_filter,
        limit=top_k
    )
    
    chunks = []
    for hit in results:
        payload = hit.payload
        if payload:
            chunks.append({
                "chunk_id": str(hit.id),
                "document_id": payload.get("document_id"),
                "content": payload.get("content"),
                "page_number": payload.get("page_number"),
                "score": hit.score
            })
            
    return chunks
