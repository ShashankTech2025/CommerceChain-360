# CommerceChain 360: REST API Specification

## 1. Overview & Base Configuration
- **Base URL**: `http://127.0.0.1:8000/api`
- **Specification**: OpenAPI 3.1.0 (`/api/openapi.json`)
- **Interactive Documentation**: Swagger UI at `/api/docs`, ReDoc at `/api/redoc`.

---

## 2. Global Query Parameters (Common Filters)
All analytical endpoints accept optional global filter query parameters:
- `start_date` (string, ISO format `YYYY-MM-DD`): Earliest purchase date filter.
- `end_date` (string, ISO format `YYYY-MM-DD`): Latest purchase date filter.
- `order_status` (string / list): Filter by status (e.g. `delivered`, `canceled`).
- `customer_state` (string / list): Filter by 2-letter customer state (e.g. `SP`, `RJ`).
- `seller_state` (string / list): Filter by 2-letter seller state.
- `category` (string / list): Filter by product category.
- `payment_type` (string / list): Filter by tender type.

---

## 3. Endpoints Catalog

### Health & Metadata
- **`GET /api/health`**: Returns application and dataset readiness status.
- **`GET /api/metadata`**: Returns valid filter dimensions (available date bounds, categories, states, payment types).

### Executive Overview
- **`GET /api/overview/kpis`**: Returns core top-line KPIs (Gross Sales, Orders, Delivered Orders, AOV, Unique Customers, On-Time Rate).
- **`GET /api/overview/trends`**: Returns monthly gross sales and monthly order volume trendlines.

### Sales Intelligence
- **`GET /api/sales/summary`**: Returns sales velocity KPIs, basket size, and average unit price.
- **`GET /api/sales/monthly`**: Returns monthly sales trend and MoM growth percentage.
- **`GET /api/sales/categories`**: Returns top 10 categories, revenue contribution share, and category economics.

### Customer Intelligence
- **`GET /api/customers/summary`**: Returns unique buyers, repeat customers, and retention rate.
- **`GET /api/customers/segments`**: Returns dynamic RFM cohort distributions and average monetary values.
- **`GET /api/customers/cohorts`**: Returns customer acquisition and cohort retention matrices.

### Product Intelligence
- **`GET /api/products/summary`**: Returns active SKUs sold, catalog breadth, and average photos.
- **`GET /api/products/categories`**: Returns top/bottom categories by gross sales, units sold, and freight ratios.

### Logistics & Delivery
- **`GET /api/logistics/summary`**: Returns average delivery days, on-time rate, and freight averages.
- **`GET /api/logistics/delays`**: Returns delivery delay variance distributions and SLA breach rates.
- **`GET /api/logistics/sellers`**: Returns merchant fulfillment latency and carrier lead times.

### Payment & Customer Experience
- **`GET /api/payments/summary`**: Returns total payment tender volume, transactions, and average installments.
- **`GET /api/payments/methods`**: Returns tender method market share (Credit Card, Boleto, Voucher, Debit).
- **`GET /api/reviews/summary`**: Returns CSAT average score, 5-star share, and delivery vs CSAT correlation.

### Data Explorer & Reports
- **`GET /api/reports/orders`**: Paginated, sortable order records table with full-text search.
- **`GET /api/reports/export`**: CSV, Excel, or JSON export stream of filtered datasets.

