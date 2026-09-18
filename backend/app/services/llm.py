from openai import OpenAI
from typing import List, Dict, Any
import json
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are GovLens, a document-grounded government information assistant. 
Answer using ONLY the provided retrieved context. Do not use outside knowledge for factual claims about the documents. 
Every factual claim based on retrieved information must have a citation. 
Never fabricate laws, regulations, numbers, dates, departments, requirements, page numbers, or quotations. 
If the context is insufficient, explicitly say so. 
Distinguish direct statements, calculations, and interpretations. 

Respond ONLY in valid JSON format matching this schema:
{
  "answer": "string (the answer text, which may contain inline citations if desired)",
  "citations": [
    {
      "chunk_id": "string",
      "page_number": integer,
      "document_id": "string",
      "reason": "string (why this chunk was cited)"
    }
  ],
  "evidence_level": "strong" | "partial" | "insufficient",
  "insufficient_information": boolean
}
"""

def generate_answer(query: str, context_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not settings.OPENAI_API_KEY:
        return {
            "answer": "OpenAI API key not set. Mock response.",
            "citations": [],
            "evidence_level": "insufficient",
            "insufficient_information": True
        }
        
    context_text = "Retrieved Context:\n"
    for chunk in context_chunks:
        context_text += f"---\nChunk ID: {chunk['chunk_id']}\nDocument ID: {chunk['document_id']}\nPage: {chunk['page_number']}\nContent: {chunk['content']}\n"
        
    user_message = f"User Query: {query}\n\n{context_text}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        response_format={ "type": "json_object" },
        temperature=0.0
    )
    
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "answer": "Error generating answer format.",
            "citations": [],
            "evidence_level": "insufficient",
            "insufficient_information": True
        }
