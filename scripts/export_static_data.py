"""
CommerceChain 360 - Precomputed Static JSON Analytics Generator
Generates validated, zero-cost static analytics JSON assets for Cloudflare Pages deployment.
Uses the identical production Python analytical engine to guarantee 100% mathematical fidelity.
"""

import sys
import os
import json
from pathlib import Path

# Set up project root and backend paths
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.services.data_loader import data_loader
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine

def generate_static_assets():
    print("=" * 70)
    print("COMMERCECHAIN 360 - STATIC ANALYTICS GENERATOR")
    print("=" * 70)

    output_dir = ROOT_DIR / "frontend" / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"[Target Directory] {output_dir}")

    # Load validated in-memory datasets
    print("[1/10] Loading verified datasets...")
    datasets = data_loader.load_all()

    # 1. Metadata
    print("[2/10] Generating metadata.json...")
    df_orders = datasets["orders"]
    df_items = datasets["order_items"]
    df_customers = datasets["customers"]
    df_sellers = datasets["sellers"]
    df_payments = datasets["payments"]

    min_date = df_orders["order_purchase_date"].min().strftime("%Y-%m-%d")
    max_date = df_orders["order_purchase_date"].max().strftime("%Y-%m-%d")
    order_statuses = sorted([str(s) for s in df_orders["order_status"].dropna().unique()])
    customer_states = sorted([str(s) for s in df_customers["customer_state"].dropna().unique()])
    seller_states = sorted([str(s) for s in df_sellers["seller_state"].dropna().unique()])
    categories = sorted([
        str(c) for c in df_items["category_english"].dropna().unique() 
        if str(c) != "Uncategorized"
    ])
    payment_types = sorted([str(p) for p in df_payments["payment_type"].dropna().unique() if str(p) != "unknown"])

    metadata = {
        "date_range": {"min_date": min_date, "max_date": max_date},
        "order_statuses": order_statuses,
        "customer_states": customer_states,
        "seller_states": seller_states,
        "categories": categories,
        "payment_types": payment_types,
        "review_scores": [1, 2, 3, 4, 5],
        "total_orders_baseline": int(df_orders["order_id"].nunique()),
        "gross_sales_baseline": round(float(df_items["price"].sum()), 2)
    }
    with open(output_dir / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    # 2. Executive Overview
    print("[3/10] Generating overview analytics...")
    overview_kpis = metrics_engine.get_executive_kpis(datasets)
    with open(output_dir / "overview_kpis.json", "w", encoding="utf-8") as f:
        json.dump(overview_kpis, f, indent=2)

    overview_trends = {"trends": analytics_engine.get_monthly_trends(datasets)}
    with open(output_dir / "overview_trends.json", "w", encoding="utf-8") as f:
        json.dump(overview_trends, f, indent=2)

    overview_insights = {"insights": analytics_engine.generate_executive_insights(datasets)}
    with open(output_dir / "overview_insights.json", "w", encoding="utf-8") as f:
        json.dump(overview_insights, f, indent=2)

    # 3. Commercial Sales
    print("[4/10] Generating sales intelligence...")
    sales_summary = metrics_engine.get_sales_kpis(datasets)
    with open(output_dir / "sales_summary.json", "w", encoding="utf-8") as f:
        json.dump(sales_summary, f, indent=2)

    sales_monthly = analytics_engine.get_monthly_trends(datasets)
    with open(output_dir / "sales_monthly.json", "w", encoding="utf-8") as f:
        json.dump(sales_monthly, f, indent=2)

    sales_categories = analytics_engine.get_category_performance(datasets)
    with open(output_dir / "sales_categories.json", "w", encoding="utf-8") as f:
        json.dump(sales_categories, f, indent=2)

    sales_regions = {"regions": analytics_engine.get_regional_sales(datasets)}
    with open(output_dir / "sales_regions.json", "w", encoding="utf-8") as f:
        json.dump(sales_regions, f, indent=2)

    # 4. Customers & RFM
    print("[5/10] Generating customer RFM segmentation...")
    customers_summary = metrics_engine.get_customer_kpis(datasets)
    with open(output_dir / "customers_summary.json", "w", encoding="utf-8") as f:
        json.dump(customers_summary, f, indent=2)

    customers_segments = analytics_engine.get_customer_analytics(datasets)
    with open(output_dir / "customers_segments.json", "w", encoding="utf-8") as f:
        json.dump(customers_segments, f, indent=2)

    # 5. Products & Catalog
    print("[6/10] Generating product economics...")
    products_summary = metrics_engine.get_product_kpis(datasets)
    with open(output_dir / "products_summary.json", "w", encoding="utf-8") as f:
        json.dump(products_summary, f, indent=2)

    products_categories = analytics_engine.get_category_performance(datasets)
    with open(output_dir / "products_categories.json", "w", encoding="utf-8") as f:
        json.dump(products_categories, f, indent=2)

    # 6. Logistics & Supply Chain
    print("[7/10] Generating logistics & SLA performance...")
    logistics_summary = metrics_engine.get_logistics_kpis(datasets)
    with open(output_dir / "logistics_summary.json", "w", encoding="utf-8") as f:
        json.dump(logistics_summary, f, indent=2)

    logistics_delays = analytics_engine.get_logistics_analytics(datasets)
    with open(output_dir / "logistics_delays.json", "w", encoding="utf-8") as f:
        json.dump(logistics_delays, f, indent=2)

    order_status_dist = analytics_engine.get_order_status_distribution(datasets)
    with open(output_dir / "logistics_order_status.json", "w", encoding="utf-8") as f:
        json.dump(order_status_dist, f, indent=2)

    sla_status_dist = analytics_engine.get_delivery_sla_distribution(datasets)
    with open(output_dir / "logistics_sla_status.json", "w", encoding="utf-8") as f:
        json.dump(sla_status_dist, f, indent=2)

    # 7. Payments & CSAT
    print("[8/10] Generating payments & CSAT correlation...")
    payments_summary = metrics_engine.get_payment_kpis(datasets)
    with open(output_dir / "payments_summary.json", "w", encoding="utf-8") as f:
        json.dump(payments_summary, f, indent=2)

    payments_methods = analytics_engine.get_payment_analytics(datasets)
    with open(output_dir / "payments_methods.json", "w", encoding="utf-8") as f:
        json.dump(payments_methods, f, indent=2)

    reviews_summary = analytics_engine.get_review_analytics(datasets)
    with open(output_dir / "reviews_summary.json", "w", encoding="utf-8") as f:
        json.dump(reviews_summary, f, indent=2)

    # 8. Order Explorer Data Table
    print("[9/10] Generating order explorer grid sample (2,000 verified orders)...")
    orders_table = analytics_engine.get_orders_table(
        datasets=datasets,
        page=1,
        page_size=2000,
        search=None,
        sort_by="order_purchase_timestamp",
        sort_desc=True
    )
    with open(output_dir / "orders_table.json", "w", encoding="utf-8") as f:
        json.dump(orders_table, f)

    # Also export top 1,000 orders as CSV for direct static export
    import io
    import pandas as pd
    df_sample = pd.DataFrame(orders_table["records"])
    df_sample.to_csv(output_dir / "orders_export.csv", index=False)

    print("[10/10] All static analytics JSON files successfully generated!")
    print(f"Generated {len(list(output_dir.glob('*.json')))} JSON files in {output_dir}")
    print("=" * 70)

if __name__ == "__main__":
    generate_static_assets()
