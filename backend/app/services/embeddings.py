from openai import OpenAI
from app.config import settings
from typing import List

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    if not settings.OPENAI_API_KEY:
        # Return mock embeddings if no key (for local testing without key)
        return [[0.0] * 1536 for _ in texts]
        
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [data.embedding for data in response.data]
