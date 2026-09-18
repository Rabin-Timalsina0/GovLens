import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Search, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-tight">GovLens</div>
        <nav className="space-x-6 text-sm font-medium">
          <Link href="/documents" className="text-gray-600 hover:text-gray-900">Documents</Link>
          <Link href="/chat" className="text-gray-600 hover:text-gray-900">Ask Question</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
          Understand Government Documents in Seconds.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Search laws, budgets, policies, reports, and public notices with answers grounded in the original documents. No hallucinations, just exact citations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/documents">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Explore Documents
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Ask a Question <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left w-full mt-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Upload & Index</h3>
            <p className="text-gray-600 text-sm">Upload complex PDF reports, laws, and budgets. We extract and index the text while preserving page structure.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ask Questions</h3>
            <p className="text-gray-600 text-sm">Ask natural language questions. Get clear answers grounded only in the provided documents.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Verify Citations</h3>
            <p className="text-gray-600 text-sm">Every claim is backed by a clickable citation. Open the exact page and paragraph to verify the source.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
