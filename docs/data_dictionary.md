# CommerceChain 360: Master Data Dictionary

## 1. Relational Entity Overview
CommerceChain 360 processes transactional e-commerce records from the Olist Brazilian E-Commerce public dataset. The data engineering pipeline cleans, type-casts, and validates each dataset into `data/processed/`.

---

## 2. Table Specifications

### 2.1. Orders (`orders_clean.csv`)
- **Grain**: 1 record per e-commerce order (99,441 records).
- **Primary Key**: `order_id` (100% unique string).
- **Attributes**:
  - `customer_id`: Foreign key linking to `customers_clean.csv`.
  - `order_status`: Transaction lifecycle state (`delivered`, `shipped`, `canceled`, `invoiced`, `processing`, `unavailable`, `created`, `approved`).
  - `order_purchase_timestamp`: Timestamp when order was placed.
  - `order_approved_at`: Payment authorization timestamp.
  - `order_delivered_carrier_date`: Timestamp when handed to postal carrier.
  - `order_delivered_customer_date`: Timestamp when parcel reached customer.
  - `order_estimated_delivery_date`: Promised SLA delivery date.
  - `delivery_days`: Total duration in days from order to delivery.
  - `estimated_delivery_days`: Promised duration in days.
  - `delivery_delay_days`: Variance between actual delivery and SLA.

### 2.2. Order Items (`order_items_clean.csv`)
- **Grain**: 1 record per order line item (112,650 records).
- **Composite Key**: `(order_id, order_item_id)`.
- **Attributes**:
  - `order_id`: Foreign key linking to `orders_clean.csv`.
  - `order_item_id`: Sequential integer index of item within order (1 to 21).
  - `product_id`: Foreign key linking to `products_clean.csv`.
  - `seller_id`: Foreign key linking to `sellers_clean.csv`.
  - `shipping_limit_date`: Merchant fulfillment deadline.
  - `price`: Unit price of item in BRL (excl. freight). Sum = Gross Item Sales.
  - `freight_value`: Shipping charges assigned to this item in BRL.
  - `total_item_value`: Price + freight value.

### 2.3. Payments (`payments_clean.csv`)
- **Grain**: 1 record per payment transaction tender (103,886 records).
- **Composite Key**: `(order_id, payment_sequential)`.
- **Attributes**:
  - `order_id`: Foreign key linking to `orders_clean.csv`.
  - `payment_sequential`: Integer sequence for split-tender payments.
  - `payment_type`: Tender method (`credit_card`, `boleto`, `voucher`, `debit_card`).
  - `payment_installments`: Number of installments selected (1 to 24).
  - `payment_value`: Monetary payment amount settled in BRL.

### 2.4. Reviews (`reviews_clean.csv`)
- **Grain**: 1 record per customer review/survey (99,224 records).
- **Composite Key**: `(review_id, order_id)`.
- **Attributes**:
  - `review_id`: Survey response identifier.
  - `order_id`: Foreign key linking to `orders_clean.csv`.
  - `review_score`: Satisfaction rating from 1 to 5 stars.
  - `review_comment_title`: Customer review headline.
  - `review_comment_message`: Detailed review text.
  - `review_creation_date`: Date survey questionnaire sent.
  - `review_answer_timestamp`: Timestamp response submitted.

### 2.5. Customers (`customers_clean.csv`)
- **Grain**: 1 record per customer order registration (99,441 records).
- **Primary Key**: `customer_id`.
- **Attributes**:
  - `customer_unique_id`: Conformed natural key identifying individual human buyer (96,096 distinct).
  - `customer_zip_code_prefix`: 5-digit postal prefix.
  - `customer_city`: Customer municipality.
  - `customer_state`: Brazilian federal state code (27 states).

### 2.6. Products (`products_clean.csv`)
- **Grain**: 1 record per product SKU (32,951 records).
- **Primary Key**: `product_id`.
- **Attributes**:
  - `product_category_name`: Portuguese category name.
  - `product_photos_qty`: Number of catalog photos.
  - `product_weight_g`: Physical weight in grams.
  - `product_length_cm`, `product_height_cm`, `product_width_cm`: Dimensions.
  - `product_volume_cm3`: Calculated cubic volume.
  - `dimensional_weight_kg`: Volumetric logistics weight.

### 2.7. Sellers (`sellers_clean.csv`)
- **Grain**: 1 record per registered merchant seller (3,095 records).
- **Primary Key**: `seller_id`.
- **Attributes**:
  - `seller_zip_code_prefix`: Merchant postal code prefix.
  - `seller_city`: Merchant municipality.
  - `seller_state`: Merchant state code (23 states).

### 2.8. Category Translation (`category_translation_clean.csv`)
- **Grain**: 1 record per category translation (71 records).
- **Attributes**:
  - `product_category_name`: Portuguese category identifier.
  - `product_category_name_english`: Standard English translation.

### 2.9. Geolocation (`geolocation_clean.csv` / `cache/postal_centroids.json`)
- **Grain**: 738,332 raw coordinate records aggregated to 19,015 postal prefix centroids.
- **Attributes**:
  - `geolocation_zip_code_prefix`: 5-digit postal prefix.
  - `lat`, `lng`: Centroid arithmetic mean coordinates.
  - `city`, `state`: Primary municipality and state.

