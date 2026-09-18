"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { chat } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: any[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<any | null>(null);
  
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      const response = await chat(userMsg.content, []);
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.answer,
        citations: response.citations
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Sorry, an error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
          <ArrowLeft className="h-4 w-4" /> GovLens
        </Link>
        <div className="space-y-2 flex-1">
          <Link href="/documents">
            <Button variant="ghost" className="w-full justify-start">Document Library</Button>
          </Link>
          <Link href="/chat">
            <Button variant="secondary" className="w-full justify-start">New Chat</Button>
          </Link>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Global Document Search</h2>
        </header>
        
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Ask a question</h3>
                <p className="text-gray-500">I will search all indexed government documents for the answer.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'assistant' ? 'bg-gray-50 p-4 rounded-lg' : 'px-4'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}>
                    {msg.role === 'user' ? 'U' : 'G'}
                  </div>
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none text-gray-800">
                      {msg.content}
                    </div>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {msg.citations.map((cit, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setActiveCitation(cit)}
                            className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 shadow-sm px-2 py-1 rounded hover:bg-gray-50"
                          >
                            <ExternalLink className="h-3 w-3" />
                            [Doc {cit.document_id.substring(0,4)}... p.{cit.page_number}]
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 animate-pulse">G</div>
                <div className="text-gray-500">Searching documents...</div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-4">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about budgets, policies, regulations..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={!!activeCitation} onOpenChange={(open) => !open && setActiveCitation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Source Citation</DialogTitle>
          </DialogHeader>
          {activeCitation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded border">
                <div><strong>Document ID:</strong> {activeCitation.document_id}</div>
                <div><strong>Page:</strong> {activeCitation.page_number}</div>
                <div className="col-span-2"><strong>Reason:</strong> {activeCitation.reason}</div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm text-gray-500">Chunk ID</h4>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">{activeCitation.chunk_id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
