# CommerceChain 360: Full-Stack Web Application Architecture

## 1. System Vision & Architecture Overview
CommerceChain 360 is transitioning from a native Power BI desktop solution to an enterprise, cloud-ready **Full-Stack Business Intelligence Web Application**. The platform consists of a high-performance **FastAPI backend** serving vectorized analytical aggregations from real Olist data and a modern **React 18 + Vite frontend** rendering interactive **Apache ECharts** visualizations with a corporate SaaS user experience.

```mermaid
flowchart TD
    subgraph Data Tier
        CSV["data/processed/*.csv (Cleaned Datasets)"]
        Parquet["Cached Parquet Aggregates (Fast Analytics)"]
    end

    subgraph Backend - FastAPI (Python 3.11)
        DL["services/data_loader.py (In-Memory / Parquet Loader)"]
        MET["services/metrics.py (Vectorized KPI Calculations)"]
        TRANS["services/transformations.py (Data Wrangling)"]
        AN["services/analytics.py (RFM, Cohorts, Trends)"]
        API["api/routes/*.py (Overview, Sales, Customers, etc.)"]
        SCH["schemas/*.py (Pydantic Response Models)"]
        
        CSV --> DL
        DL --> Parquet
        DL --> TRANS --> MET & AN
        MET & AN --> API --> SCH
    end

    subgraph Frontend - React 18 + Vite (Tailwind CSS)
        RC["React Query Cache & Axios Client"]
        GF["Global Filter Context (Date, State, Status, Category)"]
        
        subgraph Visuals & Pages
            NAV["Sidebar & Header Navigation"]
            P1["Overview.jsx (Executive Briefing)"]
            P2["Sales.jsx (Commercial Intelligence)"]
            P3["Customers.jsx (Retention & RFM)"]
            P4["Products.jsx (Merchandise Analytics)"]
            P5["Logistics.jsx (SLA & Delivery Delays)"]
            P6["Payments.jsx (Tender & CSAT)"]
            P7["DataExplorer.jsx (Searchable Data Tables)"]
            P8["Reports.jsx (Executive Summaries & Export)"]
            ECH["Apache ECharts Components (Responsive & Interactive)"]
        end
        
        SCH -->|REST API (JSON)| RC
        RC --> GF --> P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8
        P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 --> ECH
    end
```

---

## 2. Backend Design (FastAPI + Pandas)

### Core Components
1. **Data Ingestion & Memory Management** (`app/services/data_loader.py`):
   - Fast initial startup loading cleaned CSVs into optimized Pandas DataFrames with explicit typing (Categories, Int32, Float32, Datetime).
   - Generates compact pre-aggregated Parquet data caches to accelerate subsequent server restarts and cold starts on free cloud hosting.
   - Respects grain boundaries across Orders (99K), Items (112K), Payments (103K), and Reviews (99K).
   - Prevents sending the raw 738K-row Geolocation dataset to the client; exposes pre-aggregated postal centroids.

2. **Analytics & Metric Calculation Engine** (`app/services/metrics.py` & `analytics.py`):
   - Vectorized metric computation matching exact business definitions: Gross Item Sales, Total Orders, Delivered Orders, AOV, Unique Customers, Repeat Purchase Rate, On-Time Delivery Rate, Late Delivery Rate, and Average Review Score.
   - Dynamic parameterized filtering supporting date intervals, order statuses, customer/seller states, and product categories.
   - Algorithmic customer segmentation (Recency, Frequency, Monetary - RFM) with transparent quantile cutoffs.

3. **RESTful API Endpoints** (`app/api/routes/`):
   - `/api/health`: Application health and dataset readiness probe.
   - `/api/metadata`: Dynamic filter dimension options (states, categories, statuses, date boundaries).
   - `/api/overview`: Executive KPIs, monthly trends, top categories, and fulfillment breakdown.
   - `/api/sales`: Granular commercial performance, MoM growth rates, and regional revenue maps.
   - `/api/customers`: Customer retention rates, RFM segment matrices, and cohort analysis.
   - `/api/products`: SKU price rationalization, units sold, and category freight ratios.
   - `/api/logistics`: Lead time distribution, on-time SLA metrics, and state delivery delay heatmaps.
   - `/api/payments`: Tender method market share, installment distributions, and CSAT rating drivers.
   - `/api/reports`: Analytical table feeds with server-side pagination, sorting, search, and CSV/Excel/PDF export.

---

## 3. Frontend Design (React + Vite + Tailwind + Apache ECharts)

### UI/UX Brand Standards
- **Style Theme**: Premium Light SaaS Interface.
- **Palette**: Deep Navy (`#0F2042`), Teal (`#0D9488`), Royal Blue (`#2563EB`), Emerald Green (`#10B981`), Amber (`#F59E0B`), Crimson Red (`#EF4444`), Clean Slate (`#F8FAFC`).
- **Typography**: Inter / Segoe UI with crisp contrast and structured typographical hierarchy.
- **Layout Structure**:
  - **Collapsible Sidebar**: Unified navigation across 7 core analytical modules and project info.
  - **Top Navigation Bar**: Active page breadcrumb, real-time date interval slicer, global filter chips, and data refresh trigger.
  - **Interactive Global Filters Bar**: Non-blocking drawer/strip with multi-select dropdowns for purchase dates, states, categories, and order statuses.
  - **Visualization Cards**: Subtle elevation, 8px rounded corners, crisp titles, and integrated Apache ECharts with tooltip cursors, zoom bars, and export options.

---

## 4. Deployment Strategy
- **Frontend**: Cloudflare Pages / Vercel (static single-page application with automated edge distribution).
- **Backend**: Render Free Web Service (Docker / Python Uvicorn container with automated warmup endpoint and memory-efficient data loading).
- **Data Persistence**: Zero dependency on paid relational databases; leverages local version-controlled production datasets and Parquet cache files.

