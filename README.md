# COMMERCECHAIN 360
## Enterprise E-Commerce Sales, Supply Chain & Delivery Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel_Frontend-commercechain--360.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://commercechain-360.vercel.app)
[![Render Backend](https://img.shields.io/badge/Render_Backend-commercechain--360--api.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://commercechain-360-api.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-CommerceChain--360-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ShashankTech2025/CommerceChain-360)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Apache ECharts](https://img.shields.io/badge/Apache_ECharts-5.5+-AA344D?style=for-the-badge&logo=apache-echarts&logoColor=white)](https://echarts.apache.org/)
[![Test Suite](https://img.shields.io/badge/Pytest-35_Tests_Passed-10B981?style=for-the-badge&logo=pytest&logoColor=white)](#quality-assurance--testing)

---

## 1. Executive Summary & Business Objective

**CommerceChain 360** is a full-stack, enterprise-grade Business Intelligence and delivery analytics web application engineered for modern retail and supply chain leadership. Operating on 100,000+ real transactions from the Brazilian E-Commerce ecosystem (Olist), the platform unifies commercial sales velocity, merchandise economics, supply chain SLA compliance, customer behavior, and customer sentiment into a single unified analytical engine.

### Core Problems Solved:
1. **Multi-Grain Data Integrity**: E-commerce data spans multiple operational grains (Orders, Items, Payments, Reviews). Blending them into denormalized flat tables causes Cartesian product inflation of sales and payments. CommerceChain 360 isolates each table at its native grain with mathematical set intersection filtering.
2. **Logistics & Delivery Bottlenecks**: Quantifies carrier lead times, transit variances, and regional SLA breaches across Brazil's 27 federal states.
3. **Customer Retention & RFM Modeling**: Identifies the platform's repeat buyer rate (3.12%) and dynamically segments 96,096 unique buyers into behavioral cohorts (`Loyal / Best`, `Potential Loyalists`, `At Risk`, `Inactive`).
4. **Logistics vs Sentiment Impact**: Quantifies the mathematical penalty of delivery delays on customer satisfaction ratings.

---

## 2. Key Business Insights & Analytical Findings

| Finding | Metric / Observation | Strategic Business Impact |
| :--- | :--- | :--- |
| **Delivery Delay CSAT Penalty** | On-Time: **4.25 ★** vs Late: **2.32 ★** (**-1.93 star penalty**) | Over 55% of delayed shipments receive a 1-star review. Delivery delay is the single highest predictor of negative customer sentiment. |
| **Customer Retention Deficit** | **96.88%** of customers purchase only once; repeat rate is **3.12%** | A +2.0 percentage point lift in repeat rate unlocks an estimated **R$ 270,000+ in high-margin repeat GMV** with near-zero CAC. |
| **Geographic Demand Disparity** | São Paulo represents **41.8%** of total order volume | SP averages **8.3 days** delivery lead time, whereas northern states (RR, AP, AM) average **25+ days** with heavy freight loads. |
| **Freight Friction Index** | Freight averages **16.57%** of item price; bulky items reach **25%+** | Heavy furniture and home goods experience high cart friction due to elevated logistics costs. |
| **Payment Tender Preference** | Credit card drives **75.8%** of GMV; average installment is **2.9x** | Extended installment plans (6x-10x) directly enable larger basket sizes for higher-priced goods. |

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React 18.3, Vite 6.0
- **Styling & Design System**: Tailwind CSS 3.4 (custom palette, dark/light mode tokens)
- **Visualizations**: Apache ECharts 5.5 (`echarts` & `echarts-for-react`)
- **Routing**: React Router 6.28
- **State Management & Caching**: `@tanstack/react-query` 5.62, React Context API (`FilterContext`, `ThemeContext`)
- **HTTP Client**: Axios 1.7
- **Icons**: Lucide React

### Backend Analytical Engine
- **Web Framework**: FastAPI 0.115, Uvicorn (ASGI)
- **Data Engineering**: Pandas 2.2, NumPy 2.1, PyArrow 18.1
- **Validation & Serialization**: Pydantic v2.10
- **Storage & Caching**: File-based analytical engine reading from `data/processed/` with optimized local Parquet caching (`data/processed/cache/`).
- **Test Automation**: Pytest 8.3, AnyIO

---

## 4. Analytical Data Model & Grain Isolation

```
                                  +-----------------------+
                                  |       DimDate         |
                                  +-----------------------+
                                  | Date (PK)             |
                                  +-----------+-----------+
                                              | 1
                                              | 
                                              | * (Purchase Date)
+-----------------------+                     |                    +-----------------------+
|     DimCustomers      |                     |                    |      DimProducts      |
+-----------------------+                     |                    +-----------------------+
| customer_id (PK)      |                     |                    | product_id (PK)       |
| customer_unique_id    |                     |                    | Category_English      |
| customer_city         |                     |                    +-----------+-----------+
| customer_state        |                     |                                | 1
+-----------+-----------+                     |                                |
            | 1                               |                                | *
            |                                 |                    +-----------+-----------+
            | *                               |                    |      DimCategory      |
+-----------+-----------+                     |                    +-----------------------+
|      FactOrders       |---------------------+                    | category_name (PK)    |
| (99,441 records)      |                                          | Category_English_Title|
+-----------------------+                                          +-----------------------+
| order_id (PK)         |<--------------------+
| customer_id (FK)      |                     |
| order_purchase_date   |                     |
| order_status          |                     |
+-----+-----+-----+-----+                     |
      | 1   | 1   | 1                         |
      |     |     |                           |
      | *   | *   | *                         |
      |     |     +-------+                   |
      |     |             |                   |
      |     v             v                   |
      |  +-------------+ +-------------+     |
      |  | FactPayments| | FactReviews |     |
      |  | (103,886 rw)| | (99,224 rw) |     |
      |  +-------------+ +-------------+     |
      |  | order_id(FK)| | order_id(FK)|     |
      |  | payment_val | | review_score|     |
      |  +-------------+ +-------------+     |
      v                                       |
+-----------------------+                     |
|    FactOrderItems     |---------------------+------------------->+-----------------------+
| (112,650 records)     | *                                      1 |      DimSellers       |
+-----------------------+                                          | (3,095 records)       |
| order_id (FK)         |                                          +-----------------------+
| product_id (FK)       |                                          | seller_id (PK)        |
| seller_id (FK)        |                                          | seller_city           |
| price, freight_value  |                                          | seller_state          |
+-----------------------+                                          +-----------------------+
```

### Verified Baseline Figures:
- **Total Orders**: `99,441` | Delivered: `96,478` (97.02%)
- **Gross Item Sales**: `R$ 13,591,643.70` | Average Order Value: `R$ 136.68`
- **Total Freight**: `R$ 2,251,909.54` | Total Payments: `R$ 16,008,872.12`
- **Unique Buyers**: `96,096` | Repeat Customers: `2,997` (3.12%)
- **On-Time Delivery Rate**: `91.89%` | Late Rate: `8.11%` (Base: 96,470 delivered with dates)
- **Average Lead Time**: `12.56 days` | Average SLA Estimate: `23.77 days`
- **Average CSAT Rating**: `4.09 / 5.00 Stars`

---

## 5. Dashboard Modules Overview

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Executive Overview** | `/` | 6 executive KPI cards, dual-axis monthly GMV & volume trend, SLA compliance ring, strategic AI commentary. |
| **Sales Intelligence** | `/sales` | Commercial sales KPIs, Top 10 category revenue bar chart, state-level sales ranking (SP highlighted), monthly AOV evolution. |
| **Customer Intelligence** | `/customers` | Retention rates, dynamic RFM matrix (Recency/Frequency/Monetary quintiles), purchase frequency distribution, retention advisory. |
| **Product & Merchandise** | `/products` | Catalog breadth (32.9K SKUs), 73 categories, Top 10 vs Bottom 10 underperforming categories, freight friction index. |
| **Supply Chain & Delivery** | `/logistics` | SLA compliance (91.89%), delivery delay variance histogram, actual vs estimated lead times, state delivery lead time ranking. |
| **Payments, Financing & CSAT** | `/payments` | Tender market share (Credit Card, Boleto, Voucher, Debit), installment profiles (1x-12x), CSAT star rating distribution, Delivery Delay CSAT impact chart. |
| **Data Explorer** | `/explorer` | Full-text search across order IDs/cities/states, column sorting, pagination controls, order detail inspection modal, live CSV/JSON export. |
| **Executive Reports** | `/reports` | Printable formal audit briefing, executive scorecard, documented findings, management roadmap, instant PDF print and CSV download. |

---

## 6. Quickstart Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive API Documentation: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
- Alternative API Spec (ReDoc): [http://127.0.0.1:8000/api/redoc](http://127.0.0.1:8000/api/redoc)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173) (Proxies `/api` to port 8000 automatically)

### 3. Production Build
```bash
# Build optimized static distribution
npm run build
```

---

## 7. Quality Assurance & Testing

```bash
# Run complete backend test suite
python -m pytest backend/tests
```

**Results:**
```
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-8.3.3, pluggy-1.7.0
rootdir: C:\...\CommerceChain 360
plugins: anyio-4.16.0
collected 35 items

backend\tests\test_analytics.py ................                         [ 45%]
backend\tests\test_api.py ..........                                     [ 74%]
backend\tests\test_health.py ..                                          [ 80%]
backend\tests\test_services.py .......                                   [100%]

============================= 35 passed in 19.89s =============================
```

- **Data Integrity Tests**: Row count reconciliation across all 9 datasets, referential integrity check.
- **KPI Reconciliation**: 100% mathematical match for GMV, orders, AOV, on-time delivery rate, CSAT average.
- **REST API Route Tests**: Validates 23 endpoint handlers with and without multi-select query filters.
- **Frontend Build**: 2,287 modules compiled into optimized vendor and ECharts chunks with zero warnings.

---

## 8. REST API Specification Summary

All analytical endpoints accept optional global filter parameters: `start_date`, `end_date`, `order_status`, `customer_state`, `seller_state`, `category`, `payment_type`, and `review_score`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System and dataset readiness status |
| `/api/metadata` | `GET` | Filter dimensions (date bounds, states, categories, payment types) |
| `/api/overview/kpis` | `GET` | Core 6 executive KPIs with multi-grain filtering |
| `/api/overview/trends` | `GET` | Monthly gross sales and order volume trendline |
| `/api/overview/insights` | `GET` | Dynamic strategic commentary |
| `/api/sales/summary` | `GET` | Sales velocity, units sold, and average item price |
| `/api/sales/monthly` | `GET` | Monthly sales trend and MoM growth percentage |
| `/api/sales/categories` | `GET` | Top 10 categories, revenue share, and unit prices |
| `/api/sales/regions` | `GET` | State-level sales, orders, and customer distribution |
| `/api/customers/summary` | `GET` | Unique buyers, repeat buyers, and retention rates |
| `/api/customers/segments` | `GET` | RFM cohort segmentation distribution and frequency bins |
| `/api/products/summary` | `GET` | Catalog breadth, active items, and freight ratio |
| `/api/products/categories` | `GET` | Top 10 vs Bottom 10 categories by revenue |
| `/api/logistics/summary` | `GET` | SLA compliance, lead times, and freight averages |
| `/api/logistics/delays` | `GET` | Delay variance histogram, actual vs estimated lead times, state SLA |
| `/api/logistics/order-status` | `GET` | Order fulfillment status breakdown |
| `/api/logistics/sla-status` | `GET` | Delivery SLA adherence distribution |
| `/api/payments/summary` | `GET` | Payment volume, transactions, and review score |
| `/api/payments/methods` | `GET` | Tender market share and credit card installment profiles |
| `/api/reviews/summary` | `GET` | Star rating distribution, monthly CSAT, and Delivery SLA vs CSAT correlation |
| `/api/reports/orders` | `GET` | Paginated, searchable, multi-column sortable order grid |
| `/api/reports/export` | `GET` | Streaming CSV / JSON file download reflecting current filters |

---

## 9. Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/              # 8 modular FastAPI route files (23 endpoints)
│   │   │   ├── deps.py              # Dependency injection & grain-safe filtering
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   └── config.py            # Environment & application configuration
│   │   ├── schemas/                 # Pydantic v2 validation models
│   │   ├── services/
│   │   │   ├── data_loader.py       # Singleton loader with Parquet caching
│   │   │   ├── data_validation.py   # Referential integrity validator
│   │   │   ├── transformations.py   # Multi-grain filtering & RFM calculation
│   │   │   ├── metrics.py           # Pure KPI calculation engine
│   │   │   └── analytics.py         # Visual aggregations & commentary generator
│   │   └── main.py                  # FastAPI application with lifespan pre-warming
│   ├── requirements.txt
│   └── tests/                       # 35 Pytest unit and integration tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/               # KPICard, ChartCard
│   │   │   ├── common/              # Badge, LoadingSpinner, Skeleton
│   │   │   ├── filters/             # MultiSelectDropdown, FilterBar
│   │   │   └── layout/              # Sidebar, Header, Layout
│   │   ├── context/                 # FilterContext, ThemeContext
│   │   ├── hooks/                   # useAnalytics (19 React Query hooks)
│   │   ├── pages/                   # 8 full dashboard modules
│   │   ├── services/                # Axios API client & filter serializer
│   │   ├── styles/                  # Tailwind CSS & custom scrollbars
│   │   └── utils/                   # Formatters & ECharts theme engine
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── data/
│   ├── raw/                         # Original source datasets
│   └── processed/                   # 9 cleaned CSV datasets + cache/*.parquet
├── docs/                            # Architectural, KPI, API & testing documentation
└── scripts/                         # CLI verification & aggregate generators
```

---

## 10. License & Credits

- **Dataset**: Brazilian Public E-Commerce Dataset by Olist (Kaggle).
- **Author**: Professional Data Analytics & Full-Stack BI Developer Portfolio.
- **License**: MIT License.
