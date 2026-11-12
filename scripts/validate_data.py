"""
CommerceChain 360 - Dataset & KPI Validation Script
Usage: python scripts/validate_data.py
"""

import os
import sys
import csv
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"

REFERENCE_METRICS = {
    "total_orders": 99441,
    "delivered_orders": 96478,
    "gross_item_sales": 13591643.70,
    "total_freight": 2251909.54,
    "total_payments": 16008872.12,
    "unique_customers": 96096,
    "aov": 136.6805,
    "delivered_with_dates": 96470,
    "ontime_orders": 88644,
    "late_orders": 7826,
    "ontime_rate_pct": 91.8876,
    "late_rate_pct": 8.1124,
    "total_reviews": 99224,
    "avg_review_score": 4.0864
}

def validate():
    print("=" * 70)
    print("COMMERCECHAIN 360 - AUTOMATED DATA VALIDATION")
    print("=" * 70)
    
    if not DATA_DIR.exists():
        print(f"ERROR: Data directory not found at {DATA_DIR}")
        sys.exit(1)
        
    # 1. Orders
    orders_set = set()
    delivered_count = 0
    delivered_with_dates = 0
    ontime_count = 0
    late_count = 0
    with open(DATA_DIR / "orders_clean.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            oid = r["order_id"]
            orders_set.add(oid)
            if r["order_status"] == "delivered":
                delivered_count += 1
                del_date = r.get("order_delivered_customer_date", "").strip()
                est_date = r.get("order_estimated_delivery_date", "").strip()
                if del_date and est_date:
                    delivered_with_dates += 1
                    if del_date <= est_date:
                        ontime_count += 1
                    else:
                        late_count += 1

    # 2. Items
    gross_sales = 0.0
    total_freight = 0.0
    items_orders = set()
    items_products = set()
    items_sellers = set()
    with open(DATA_DIR / "order_items_clean.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            gross_sales += float(r["price"])
            total_freight += float(r["freight_value"])
            items_orders.add(r["order_id"])
            items_products.add(r["product_id"])
            items_sellers.add(r["seller_id"])

    # 3. Payments
    total_payments = 0.0
    payments_orders = set()
    with open(DATA_DIR / "payments_clean.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            total_payments += float(r["payment_value"])
            payments_orders.add(r["order_id"])

    # 4. Customers
    unique_customers = set()
    with open(DATA_DIR / "customers_clean.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            unique_customers.add(r["customer_unique_id"])

    # 5. Reviews
    review_scores = []
    reviews_orders = set()
    with open(DATA_DIR / "reviews_clean.csv", "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            review_scores.append(int(r["review_score"]))
            reviews_orders.add(r["order_id"])

    avg_review = sum(review_scores) / len(review_scores) if review_scores else 0
    ontime_rate = (ontime_count / delivered_with_dates * 100) if delivered_with_dates else 0
    late_rate = (late_count / delivered_with_dates * 100) if delivered_with_dates else 0

    computed = {
        "total_orders": len(orders_set),
        "delivered_orders": delivered_count,
        "gross_item_sales": round(gross_sales, 2),
        "total_freight": round(total_freight, 2),
        "total_payments": round(total_payments, 2),
        "unique_customers": len(unique_customers),
        "aov": round(gross_sales / len(orders_set), 4),
        "delivered_with_dates": delivered_with_dates,
        "ontime_orders": ontime_count,
        "late_orders": late_count,
        "ontime_rate_pct": round(ontime_rate, 4),
        "late_rate_pct": round(late_rate, 4),
        "total_reviews": len(review_scores),
        "avg_review_score": round(avg_review, 4)
    }

    all_passed = True
    print(f"{'KPI / Metric':<30} | {'Benchmark':<15} | {'Actual':<15} | {'Status'}")
    print("-" * 70)
    for k, bench in REFERENCE_METRICS.items():
        actual = computed[k]
        diff = abs(actual - bench)
        passed = diff < 0.01
        if not passed:
            all_passed = False
        status_str = "PASS" if passed else f"FAIL (diff: {diff})"
        print(f"{k:<30} | {bench:<15} | {actual:<15} | {status_str}")

    print("-" * 70)
    # Referential integrity checks
    unmatched_items = len(items_orders - orders_set)
    unmatched_payments = len(payments_orders - orders_set)
    unmatched_reviews = len(reviews_orders - orders_set)

    print(f"Unmatched Order Items -> Orders: {unmatched_items}")
    print(f"Unmatched Payments -> Orders:    {unmatched_payments}")
    print(f"Unmatched Reviews -> Orders:     {unmatched_reviews}")

    if all_passed and unmatched_items == 0 and unmatched_payments == 0 and unmatched_reviews == 0:
        print("\nAll data integrity checks PASSED successfully.")
        return 0
    else:
        print("\nSome checks FAILED.")
        return 1

if __name__ == "__main__":
    sys.exit(validate())

