import uuid
import logging
from typing import List
from app.db.supabase import get_supabase_client
from app.db.qdrant import get_qdrant_client
from app.utils.pdf import extract_text_and_chunk
from app.services.embeddings import generate_embeddings
from app.models.documents import ChunkMetadata
from qdrant_client.models import PointStruct, VectorParams, Distance

logger = logging.getLogger(__name__)

def process_document(file_bytes: bytes, filename: str, document_id: str):
    supabase = get_supabase_client()
    qdrant = get_qdrant_client()
    
    COLLECTION_NAME = "documents"
    
    # Ensure Qdrant collection exists
    try:
        qdrant.get_collection(COLLECTION_NAME)
    except Exception:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
        )
    
    try:
        # Update status to processing
        supabase.table("documents").update({"status": "processing"}).eq("id", document_id).execute()
        
        # Extract text and chunk
        chunks = extract_text_and_chunk(file_bytes, document_id)
        
        if not chunks:
            raise ValueError("No text extracted from document.")
            
        # Generate embeddings
        texts = [chunk.content for chunk in chunks]
        embeddings = generate_embeddings(texts)
        
        # Store in Qdrant
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point_id = str(uuid.uuid4())
            points.append(
                PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "document_id": chunk.document_id,
                        "chunk_index": chunk.chunk_index,
                        "page_number": chunk.page_number,
                        "section_title": chunk.section_title,
                        "content": chunk.content
                    }
                )
            )
        
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        
        # Update status to indexed
        supabase.table("documents").update({"status": "indexed"}).eq("id", document_id).execute()
        
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {e}")
        supabase.table("documents").update({"status": "failed"}).eq("id", document_id).execute()

