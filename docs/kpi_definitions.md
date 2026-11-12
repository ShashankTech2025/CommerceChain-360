# CommerceChain 360: Master Business KPI Definitions

## 1. Commercial & Sales Intelligence

### Gross Item Sales
- **Business Meaning**: Gross revenue generated exclusively from ordered merchandise items, excluding freight.
- **Formula**: $\sum (\text{order\_items.price})$
- **Baseline Value**: R$ 13,591,643.70
- **Grain**: Line-Item level.
- **Important Note**: Gross Item Sales is neither Net Revenue nor Net Operating Profit. Supplier COGS is unavailable in public dataset.

### Total Freight
- **Business Meaning**: Total logistics charges paid by customers across all items.
- **Formula**: $\sum (\text{order\_items.freight\_value})$
- **Baseline Value**: R$ 2,251,909.54

### Total Orders
- **Business Meaning**: Total distinct order transactions created on the platform.
- **Formula**: $\text{COUNT}(\text{DISTINCT } \text{orders.order\_id})$
- **Baseline Value**: 99,441 orders.

### Delivered Orders
- **Business Meaning**: Completed orders successfully delivered to customers.
- **Formula**: Orders where $\text{order\_status} = \text{'delivered'}$.
- **Baseline Value**: 96,478 orders (97.02% fulfillment rate).

### Average Order Value (AOV)
- **Business Meaning**: Mean merchandise revenue generated per placed order.
- **Formula**: $\frac{\text{Gross Item Sales}}{\text{Total Orders}}$
- **Baseline Value**: R$ 136.6805

### Delivered Order AOV
- **Business Meaning**: Mean merchandise revenue for successfully delivered orders.
- **Formula**: $\frac{\text{Gross Item Sales of Delivered Orders}}{\text{Delivered Orders}}$

---

## 2. Customer & Retention Intelligence

### Unique Customers
- **Business Meaning**: Count of unique human consumers who placed at least one order.
- **Formula**: $\text{COUNT}(\text{DISTINCT } \text{customers.customer\_unique\_id})$
- **Baseline Value**: 96,096 distinct individuals.

### Repeat Customers
- **Business Meaning**: Customers who placed $\ge 2$ distinct orders during the reporting period.
- **Baseline Value**: 2,997 customers.

### One-Time Customers
- **Business Meaning**: Customers who placed exactly 1 order during the reporting period.
- **Baseline Value**: 93,099 customers.

### Repeat Customer Rate (%)
- **Formula**: $\frac{\text{Repeat Customers}}{\text{Unique Customers}} \times 100$
- **Baseline Value**: 3.1188% (~3.12%)

### Average Customer Spend
- **Formula**: $\frac{\text{Gross Item Sales}}{\text{Unique Customers}}$
- **Baseline Value**: R$ 141.4382

---

## 3. Supply Chain & Delivery Intelligence

### Delivered Orders with Timestamps
- **Business Meaning**: Delivered orders with populated actual and estimated delivery dates.
- **Baseline Value**: 96,470 orders (8 delivered orders lack actual delivery dates).

### Actual Delivery Days
- **Formula**: $\text{order\_delivered\_customer\_date} - \text{order\_purchase\_timestamp}$ (in days)
- **Baseline Mean**: 12.5587 days (~12.56 days).

### Delivery Delay Days
- **Formula**: $\text{order\_delivered\_customer\_date} - \text{order\_estimated\_delivery\_date}$ (in days)
  - Delay $\le 0$: On Time / Early
  - Delay $> 0$: Late

### On-Time Delivery Rate (%)
- **Formula**: $\frac{\text{On-Time Delivered Orders}}{\text{Delivered Orders with Timestamps}} \times 100$
- **Baseline Value**: 91.8876% (88,644 orders, ~91.89%).

### Late Delivery Rate (%)
- **Formula**: $\frac{\text{Late Delivered Orders}}{\text{Delivered Orders with Timestamps}} \times 100$
- **Baseline Value**: 8.1124% (7,826 orders, ~8.11%).

---

## 4. Payment & Customer Experience (CSAT)

### Total Recorded Payment Value
- **Formula**: $\sum (\text{payments.payment\_value})$
- **Baseline Value**: R$ 16,008,872.12

### Average Review Score
- **Formula**: $\text{MEAN}(\text{reviews.review\_score})$
- **Baseline Value**: 4.0864 / 5.00 (~4.09).

### 5-Star Review Share (%)
- **Formula**: $\frac{\text{Count of 5-Star Reviews}}{\text{Total Reviews}} \times 100$
- **Baseline Value**: 57.7764% (57,328 reviews, ~57.78%).

### Low-Rating Review Share (%)
- **Formula**: $\frac{\text{Count of 1 & 2-Star Reviews}}{\text{Total Reviews}} \times 100$
- **Baseline Value**: 14.6890% (14,575 reviews, ~14.69%).

