from qdrant_client import QdrantClient
from app.config import settings

def get_qdrant_client() -> QdrantClient:
    url = settings.QDRANT_URL
    api_key = settings.QDRANT_API_KEY
    if not url:
         # use memory for local dev if not provided
         return QdrantClient(":memory:")
    
    if api_key:
        return QdrantClient(url=url, api_key=api_key)
    else:
        return QdrantClient(url=url)
