# CommerceChain 360: Zero-Cost Deployment Architecture Guide
## Cloudflare Pages (Primary Zero-Cost Edge) & Render Free (Optional Full-Stack)

---

## 1. Zero-Cost Financial Guarantee (Strictly ₹0 / $0)

This project is architected for **genuine zero-cost deployment**:
- **No credit card, debit card, or banking details required**.
- **No billing account setup**.
- **No paid trials or auto-upgrading tiers**.
- **No paid add-ons or custom domain purchases required**.
- Both Cloudflare Pages and Render Free tiers run on free subdomains (`*.pages.dev` and `*.onrender.com`).

---

## 2. Deployment Architecture Options

### Option A: Cloudflare Pages Edge (Recommended — 100% Reliable, 0ms Cold-Start)
- **Hosting**: Cloudflare Pages (Free Tier)
- **Data Engine**: Precomputed analytical JSON cache (`frontend/public/data/*.json`) generated directly from the validated Python analytics engine.
- **Benefits**:
  - **Zero cold start**: Unlike containerized free servers that sleep after 15 minutes, Cloudflare Pages loads in < 50ms worldwide.
  - **Zero maintenance**: Never crashes due to memory limits.
  - **Client-side capabilities**: Preserves all 8 interactive dashboard pages, ECharts graphs, and full-text search/pagination in the Data Explorer.

### Option B: Cloudflare Pages + Render Free Web Service (Full-Stack Live API)
- **Frontend**: Cloudflare Pages
- **Backend**: Render Free Python Service (`render.yaml` provided)
- **Benefits**: Real-time multi-grain Python analytical calculations for arbitrary custom query combinations.
- **Fail-Safe Fallback**: If Render is asleep or experiencing a cold start (takes ~50s to wake up), the frontend's hybrid service automatically serves the cached data from `public/data/` with zero broken screens.

---

## 3. Step-by-Step Deployment: Cloudflare Pages (Frontend)

Cloudflare Pages provides completely free hosting for static and SPA sites with zero credit card requirements.

### Step 1: Sign Up / Log In
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Sign up with your email (no payment details requested).

### Step 2: Create a Pages Project
1. In the Cloudflare dashboard left menu, click **Workers & Pages**.
2. Click **Create Application** &rarr; select the **Pages** tab.
3. Click **Connect to Git** and choose GitHub.
4. Authorize Cloudflare to access repository: `ShashankTech2025/CommerceChain-360`.

### Step 3: Configure Build Settings
Fill in the deployment parameters:
- **Project Name**: `commercechain-360` (or your preferred name)
- **Production Branch**: `main`
- **Framework Preset**: `Vite` (or None)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`

### Step 4: Environment Variables (Optional)
If deploying alongside Render:
- `VITE_API_BASE_URL`: `https://commercechain-360-api.onrender.com/api`
*(If omitted, the application operates in high-speed zero-cost static mode using precomputed data)*.

### Step 5: Deploy
Click **Save and Deploy**. Cloudflare will build the site in ~1 minute and provide your live URL:
`https://commercechain-360.pages.dev`

### SPA Routing & Deep Linking:
Single Page Applications require routing fallbacks so that refreshing `/sales` or `/logistics` doesn't 404. CommerceChain 360 includes `frontend/public/_redirects`:
```
/*    /index.html   200
```
This is automatically copied to `dist/` during build and recognized by Cloudflare Pages.

---

## 4. Step-by-Step Deployment: Render Free (Backend — Optional)

If you wish to host the live Python FastAPI backend alongside the frontend:

### Step 1: Sign Up / Log In
1. Go to [render.com](https://render.com).
2. Sign in with GitHub (Free plan, no card required).

### Step 2: Create Web Service from Blueprint
1. Click **New +** &rarr; select **Blueprint**.
2. Connect `ShashankTech2025/CommerceChain-360`.
3. Render will detect `render.yaml` in the root directory.
4. Alternatively, click **New +** &rarr; **Web Service**:
   - **Name**: `commercechain-360-api`
   - **Runtime**: `Python`
   - **Root Directory**: `backend` (or root with `--app-dir backend`)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free` ($0/mo)

### Step 3: Environment Variables
- `PYTHON_VERSION`: `3.11.9`
- `DEBUG`: `False`
- `CORS_ORIGINS`: `https://commercechain-360.pages.dev,https://commercechain-360.vercel.app,http://localhost:5173`

---

## 5. How to Regenerate Precomputed Data Locally

Whenever underlying raw or processed datasets are updated, regenerate the static JSON assets using:

```powershell
python scripts/export_static_data.py
```

This runs the analytical engine across all 9 fact and dimension tables and outputs 20 optimized JSON files to `frontend/public/data/`.
