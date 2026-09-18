"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDocuments, uploadDocument } from "@/lib/api";
import { ArrowLeft, Upload, File as FileIcon, Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file);
      setFile(null);
      fetchDocs();
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="text-3xl font-bold">Document Library</h1>
          </div>
          <Link href="/chat">
            <Button>Ask a Question</Button>
          </Link>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <FileIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
                <p className="text-gray-500 mt-1">Upload a PDF to get started.</p>
              </div>
            ) : (
              documents.map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          {doc.status === 'indexed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {doc.status === 'processing' && <Clock className="h-4 w-4 text-yellow-500" />}
                          {doc.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                          {doc.status}
                        </span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/chat/${doc.id}`}>
                      <Button variant="outline" size="sm">Ask about this</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <FileIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">
                        {file ? file.name : "Click to select PDF"}
                      </span>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={!file || uploading}>
                    {uploading ? "Uploading..." : "Upload & Index"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
