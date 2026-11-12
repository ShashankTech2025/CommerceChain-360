"""
CommerceChain 360 - Comprehensive REST API Test Suite
Tests all FastAPI endpoint route handlers, dependencies, and parameter parsers.
"""

import sys
from pathlib import Path
import pytest
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.data_loader import data_loader
from app.api.deps import (
    get_datasets,
    get_filter_params,
    get_filtered_datasets,
    _parse_list_param,
    _parse_int_list_param
)
from app.api.routes.metadata import get_metadata
from app.api.routes.overview import get_executive_kpis, get_overview_trends, get_executive_insights
from app.api.routes.sales import get_sales_summary, get_sales_monthly, get_sales_categories, get_sales_regions
from app.api.routes.customers import get_customers_summary, get_customers_segments
from app.api.routes.products import get_products_summary, get_products_categories
from app.api.routes.logistics import (
    get_logistics_summary,
    get_logistics_delays,
    get_order_status_distribution,
    get_delivery_sla_distribution
)
from app.api.routes.payments import get_payments_summary, get_payment_methods, get_reviews_summary
from app.api.routes.reports import get_orders_table, export_orders_data

@pytest.fixture(scope="module")
def datasets():
    return data_loader.load_all()

# --- 1. Parameter Parser Tests ---
def test_parse_list_param():
    assert _parse_list_param(None) is None
    assert _parse_list_param([]) is None
    assert _parse_list_param(["SP,RJ", "MG"]) == ["SP", "RJ", "MG"]
    assert _parse_list_param(["delivered"]) == ["delivered"]

def test_parse_int_list_param():
    assert _parse_int_list_param(None) is None
    assert _parse_int_list_param(["5,4", "1"]) == [5, 4, 1]
    assert _parse_int_list_param(["invalid", "3"]) == [3]

# --- 2. Metadata Route Test ---
def test_metadata_endpoint(datasets):
    res = get_metadata(datasets)
    assert res.date_range.min_date.startswith("2016")
    assert res.date_range.max_date.startswith("2018")
    assert "SP" in res.customer_states
    assert len(res.customer_states) == 27
    assert len(res.categories) >= 70
    assert "credit_card" in res.payment_types
    assert res.total_orders_baseline == 99441
    assert res.gross_sales_baseline > 13500000.0

# --- 3. Executive Overview Routes Tests ---
def test_overview_endpoints(datasets):
    # Unfiltered KPIs
    kpis = get_executive_kpis(datasets)
    assert kpis.total_orders == 99441
    assert kpis.gross_item_sales == 13591643.70
    assert kpis.on_time_delivery_rate_pct == 91.89

    # Filtered KPIs (e.g. only delivered orders)
    filtered = get_filtered_datasets(datasets, {"order_status": ["delivered"], "start_date": None, "end_date": None, "customer_state": None, "seller_state": None, "category": None, "payment_type": None, "review_score": None})
    filtered_kpis = get_executive_kpis(filtered)
    assert filtered_kpis.total_orders == 96478
    assert filtered_kpis.fulfillment_rate_pct == 100.0

    # Monthly Trends
    trends_res = get_overview_trends(datasets)
    assert len(trends_res.trends) > 20
    assert trends_res.trends[0].total_orders > 0

    # Strategic Commentary Insights
    insights_res = get_executive_insights(datasets)
    assert len(insights_res.insights) >= 4
    types = [i.type for i in insights_res.insights]
    assert "logistics_csat" in types
    assert "retention" in types

# --- 4. Sales Intelligence Routes Tests ---
def test_sales_endpoints(datasets):
    summary = get_sales_summary(datasets)
    assert summary.total_orders == 99441
    assert summary.units_sold == 112650
    assert summary.average_order_value == 136.68

    monthly = get_sales_monthly(datasets)
    assert len(monthly) > 20

    cats = get_sales_categories(datasets)
    assert len(cats.top_10) == 10
    assert cats.top_10[0].gross_item_sales >= cats.top_10[1].gross_item_sales
    assert len(cats.all_categories) >= 70

    regions = get_sales_regions(datasets)
    assert len(regions.regions) == 27
    assert regions.regions[0].state == "SP"
    assert regions.regions[0].gross_item_sales > 5000000.0

# --- 5. Customer Intelligence Routes Tests ---
def test_customers_endpoints(datasets):
    summary = get_customers_summary(datasets)
    assert summary.unique_customers == 96096
    assert summary.repeat_customers == 2997
    assert summary.repeat_customer_rate_pct == 3.12

    segments = get_customers_segments(datasets)
    assert len(segments.segments) >= 4
    assert len(segments.frequency_distribution) >= 2
    assert segments.frequency_distribution[0].order_count == 1

# --- 6. Product Intelligence Routes Tests ---
def test_products_endpoints(datasets):
    summary = get_products_summary(datasets)
    assert summary.total_products_catalog == 32951
    assert summary.active_products_sold == 32951
    assert summary.units_sold == 112650

    cats = get_products_categories(datasets)
    assert len(cats.top_10) == 10

# --- 7. Supply Chain & Logistics Routes Tests ---
def test_logistics_endpoints(datasets):
    summary = get_logistics_summary(datasets)
    assert summary.on_time_delivery_rate_pct == 91.89
    assert summary.average_delivery_days == 12.6

    delays = get_logistics_delays(datasets)
    assert len(delays.delay_distribution) == 7
    assert len(delays.actual_vs_estimated) > 20
    assert len(delays.state_sla) == 27

    status_dist = get_order_status_distribution(datasets)
    assert any(d.status == "delivered" for d in status_dist)

    sla_dist = get_delivery_sla_distribution(datasets)
    assert any(d.status == "On Time / Early" for d in sla_dist)

# --- 8. Payment & CSAT Review Routes Tests ---
def test_payments_and_reviews_endpoints(datasets):
    pay_summary = get_payments_summary(datasets)
    assert pay_summary.total_recorded_payments == 16008872.12
    assert pay_summary.average_review_score == 4.09

    methods = get_payment_methods(datasets)
    assert len(methods.payment_methods) >= 4
    method_names = [m.payment_type for m in methods.payment_methods]
    assert "Credit Card" in method_names

    reviews = get_reviews_summary(datasets)
    assert len(reviews.rating_distribution) == 5
    assert len(reviews.monthly_csat) > 20
    assert "On Time / Early" in reviews.delivery_csat_correlation
    assert "Late" in reviews.delivery_csat_correlation
    assert reviews.delivery_csat_correlation["On Time / Early"].avg_score > reviews.delivery_csat_correlation["Late"].avg_score

# --- 9. Reports & Export Routes Tests ---
def test_reports_endpoints(datasets):
    # Pagination
    table = get_orders_table(page=1, page_size=15, search=None, sort_by="order_purchase_timestamp", sort_desc=True, filtered_datasets=datasets)
    assert table.total == 99441
    assert len(table.records) == 15
    assert table.page == 1
    assert table.total_pages == 6630

    # Search filter
    searched = get_orders_table(page=1, page_size=10, search="sao paulo", sort_by="order_purchase_timestamp", sort_desc=True, filtered_datasets=datasets)
    assert searched.total > 0
    assert len(searched.records) == 10

    # CSV Export
    csv_resp = export_orders_data(format="csv", search=None, sort_by="order_purchase_timestamp", sort_desc=True, limit=50, filtered_datasets=datasets)
    assert csv_resp.media_type == "text/csv"

    # JSON Export
    json_resp = export_orders_data(format="json", search=None, sort_by="order_purchase_timestamp", sort_desc=True, limit=50, filtered_datasets=datasets)
    assert json_resp.media_type == "application/json"

