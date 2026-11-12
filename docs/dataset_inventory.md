# CommerceChain 360: Dataset Inventory & Data Profiling Report

## 1. Overview
The CommerceChain 360 platform is powered by the cleaned Brazilian E-Commerce public dataset by Olist, located in `data/processed/`. All nine datasets were audited to confirm row counts, schema definitions, null distributions, primary/composite key constraints, and referential integrity.

---

## 2. Dataset Master Inventory

| # | Dataset File | Rows | Columns | Primary / Composite Key | Key Status | Null Cells |
| :-: | :--- | :---: | :---: | :--- | :---: | :---: |
| **1** | `orders_clean.csv` | 99,441 | 19 | `order_id` | 100% Unique | 10,838 (carrier/delivery timestamps) |
| **2** | `order_items_clean.csv` | 112,650 | 14 | `(order_id, order_item_id)` | 100% Unique | 0 |
| **3** | `payments_clean.csv` | 103,886 | 12 | `(order_id, payment_sequential)` | 100% Unique | 0 |
| **4** | `reviews_clean.csv` | 99,224 | 17 | `(review_id, order_id)` | 100% Unique | 291,864 (optional comment titles/texts) |
| **5** | `customers_clean.csv` | 99,441 | 5 | `customer_id` | 100% Unique | 0 |
| **6** | `products_clean.csv` | 32,951 | 21 | `product_id` | 100% Unique | 2,452 (610 missing categories/attributes) |
| **7** | `sellers_clean.csv` | 3,095 | 10 | `seller_id` | 100% Unique | 0 |
| **8** | `category_translation_clean.csv` | 71 | 7 | `product_category_name` | 100% Unique | 0 |
| **9** | `geolocation_clean.csv` | 738,332 | 6 | `geolocation_zip_code_prefix` | 19,015 prefixes | 0 |

---

## 3. Referential Integrity Audit

| Foreign Key Relationship | Source Key | Target Key | Records Checked | Unmatched | Match Rate |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Orders &rarr; Customers** | `orders.customer_id` | `customers.customer_id` | 99,441 | 0 | **100.0%** |
| **Items &rarr; Orders** | `order_items.order_id` | `orders.order_id` | 112,650 | 0 | **100.0%** |
| **Items &rarr; Products** | `order_items.product_id` | `products.product_id` | 112,650 | 0 | **100.0%** |
| **Items &rarr; Sellers** | `order_items.seller_id` | `sellers.seller_id` | 112,650 | 0 | **100.0%** |
| **Payments &rarr; Orders** | `payments.order_id` | `orders.order_id` | 103,886 | 0 | **100.0%** |
| **Reviews &rarr; Orders** | `reviews.order_id` | `orders.order_id` | 99,224 | 0 | **100.0%** |

---

## 4. Key Verified Baseline Metrics

The following metrics serve as the single source of truth for backend analytics engine validation:

- **Total Orders**: 99,441
- **Delivered Orders**: 96,478 (97.02% fulfillment rate)
- **Gross Item Sales**: R$ 13,591,643.70
- **Total Shipping Freight**: R$ 2,251,909.54
- **Total Recorded Payment Value**: R$ 16,008,872.12
- **Unique Human Customers**: 96,096
- **Average Order Value (AOV)**: R$ 136.68
- **Delivered Orders with Timestamps**: 96,470 (8 delivered orders lack actual delivery dates)
- **On-Time Delivered Orders**: 88,644
- **Late Delivered Orders**: 7,826
- **On-Time Delivery Rate**: 91.89%
- **Late Delivery Rate**: 8.11%
- **Average Review Score**: 4.09 / 5.00

