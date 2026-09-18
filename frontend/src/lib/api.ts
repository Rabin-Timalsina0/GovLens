const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) throw new Error("Upload failed");
  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_URL}/documents/`);
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
}

export async function chat(message: string, documentIds: string[] = [], conversationId?: string) {
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      document_ids: documentIds,
      conversation_id: conversationId,
    }),
  });
  
  if (!response.ok) throw new Error("Chat failed");
  return response.json();
}
