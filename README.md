# GovLens - AI Government Document Navigator

GovLens is an MVP for understanding government documents.

## Architecture & Tech Stack

### Frontend
- Next.js (App Router)
- React, TypeScript
- Tailwind CSS, shadcn/ui

### Backend
- FastAPI (Python)
- Pydantic
- Supabase (PostgreSQL)
- Qdrant (Vector DB)
- OpenAI (gpt-4o-mini, text-embedding-3-small)

## Setup

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in your keys:
- `OPENAI_API_KEY`
- `QDRANT_URL` (or leave empty for local in-memory DB)
- `QDRANT_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database
Run the SQL script in `supabase_schema.sql` on your Supabase instance to create the necessary tables.

### Run Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt # (or install directly)
uvicorn app.main:app --reload
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

