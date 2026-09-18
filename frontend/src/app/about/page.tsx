import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border shadow-sm">
        <Link href="/" className="inline-flex items-center gap-2 font-medium text-blue-600 mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">About GovLens</h1>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p>
            GovLens is an experimental civic-tech tool designed to help citizens, journalists, and researchers navigate complex government documents.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">How it Works</h2>
          <p>
            We use a technique called Retrieval-Augmented Generation (RAG). When you upload a document, we break it into smaller pieces and create semantic embeddings. When you ask a question, we retrieve only the most relevant pieces of information and provide them to an AI to generate a grounded answer.
          </p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Limitations & Disclaimer</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Not Legal Advice:</strong> GovLens does not replace official government advice or legal counsel.</li>
            <li><strong>AI Hallucinations:</strong> While strictly prompted to only use provided context, AI systems can still occasionally misinterpret information. Always verify against the original document using the provided citations.</li>
            <li><strong>Accuracy:</strong> Retrieval accuracy depends on the quality of the uploaded PDF and OCR extraction.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
