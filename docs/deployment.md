# CommerceChain 360: Deployment Guide (Cloudflare Pages & Render)

## 1. Deployment Architecture
CommerceChain 360 is engineered for seamless, zero-cost cloud deployment using:
- **Frontend**: Cloudflare Pages (Global CDN Edge hosting for React/Vite SPA).
- **Backend**: Render Free Web Service (Python/FastAPI Container with automatic Uvicorn process manager).
- **Data Persistence**: In-memory analytical engine backed by pre-aggregated Parquet caches—100% self-contained with no external database requirements.

---

## 2. Backend Deployment (Render)

### Step 1: Create Web Service
1. Connect your GitHub repository to [Render](https://render.com).
2. Select **New Web Service** &rarr; point to repository.
3. Configure settings:
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

### Step 2: Environment Variables
- `DEBUG`: `False`
- `CORS_ORIGINS`: `https://commercechain-360.pages.dev,http://localhost:5173`

### Step 3: Cold-Start Handling
On Render Free Tier, backend instances spin down after 15 minutes of inactivity. The React frontend is equipped with an automatic keep-alive / warmup probe hitting `/api/health` with visual loading indicators.

---

## 3. Frontend Deployment (Cloudflare Pages)

### Step 1: Connect Repository
1. In Cloudflare Dashboard, navigate to **Compute (Workers) &rarr; Pages**.
2. Select **Connect to Git** &rarr; choose repository.

### Step 2: Build Settings
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://commercechain-360-api.onrender.com`

---

## 4. Local Development Quickstart

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

