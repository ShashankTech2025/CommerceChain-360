import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from app.services.data_loader import data_loader
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine

@pytest.fixture(scope="session")
def loaded_datasets():
    return data_loader.load_all()

def test_executive_kpis(loaded_datasets):
    kpis = metrics_engine.get_executive_kpis(loaded_datasets)
    assert kpis["total_orders"] == 99441
    assert kpis["delivered_orders"] == 96478
    assert kpis["gross_item_sales"] == 13591643.70
    assert kpis["unique_customers"] == 96096
    assert abs(kpis["average_order_value"] - 136.68) < 0.05
    assert abs(kpis["on_time_delivery_rate_pct"] - 91.89) < 0.05

def test_sales_kpis(loaded_datasets):
    kpis = metrics_engine.get_sales_kpis(loaded_datasets)
    assert kpis["units_sold"] == 112650
    assert kpis["total_freight"] == 2251909.54
    assert kpis["delivered_order_aov"] > 0

def test_customer_kpis(loaded_datasets):
    kpis = metrics_engine.get_customer_kpis(loaded_datasets)
    assert kpis["unique_customers"] == 96096
    assert kpis["repeat_customers"] == 2997
    assert kpis["one_time_customers"] == 93099
    assert abs(kpis["repeat_customer_rate_pct"] - 3.12) < 0.05
    assert abs(kpis["average_customer_spend"] - 141.44) < 0.05

def test_product_kpis(loaded_datasets):
    kpis = metrics_engine.get_product_kpis(loaded_datasets)
    assert kpis["active_products_sold"] == 32951
    assert kpis["total_categories"] == 73
    assert kpis["units_sold"] == 112650

def test_logistics_kpis(loaded_datasets):
    kpis = metrics_engine.get_logistics_kpis(loaded_datasets)
    assert kpis["delivered_with_dates"] == 96470
    assert kpis["ontime_orders"] == 88644
    assert kpis["late_orders"] == 7826
    assert abs(kpis["on_time_delivery_rate_pct"] - 91.89) < 0.05
    assert abs(kpis["late_delivery_rate_pct"] - 8.11) < 0.05
    assert abs(kpis["average_delivery_days"] - 12.6) < 0.2

def test_payment_kpis(loaded_datasets):
    kpis = metrics_engine.get_payment_kpis(loaded_datasets)
    assert kpis["total_recorded_payments"] == 16008872.12
    assert kpis["total_payment_transactions"] == 103886
    assert kpis["total_reviews"] == 99224
    assert abs(kpis["average_review_score"] - 4.09) < 0.05
    assert kpis["five_star_reviews"] == 57328
    assert kpis["low_rating_reviews"] == 14575

def test_monthly_trends(loaded_datasets):
    trends = analytics_engine.get_monthly_trends(loaded_datasets)
    assert len(trends) > 12
    assert trends[0]["gross_item_sales"] >= 0
    assert trends[0]["total_orders"] >= 0

def test_category_performance(loaded_datasets):
    perf = analytics_engine.get_category_performance(loaded_datasets)
    assert len(perf["top_10"]) == 10
    assert len(perf["bottom_10"]) == 10
    total_sales = sum(c["gross_item_sales"] for c in perf["all_categories"])
    assert abs(total_sales - 13591643.70) < 1.0

def test_regional_sales(loaded_datasets):
    regional = analytics_engine.get_regional_sales(loaded_datasets)
    assert len(regional) == 27
    assert regional[0]["state"] == "SP"

def test_order_status_distribution(loaded_datasets):
    dist = analytics_engine.get_order_status_distribution(loaded_datasets)
    total_orders = sum(d["count"] for d in dist)
    assert total_orders == 99441

def test_delivery_delays_distribution(loaded_datasets):
    analytics = analytics_engine.get_logistics_analytics(loaded_datasets)
    assert len(analytics["delay_distribution"]) == 7
    assert len(analytics["actual_vs_estimated"]) > 10
    assert len(analytics["state_sla"]) == 27

def test_rfm_customer_analytics(loaded_datasets):
    analytics = analytics_engine.get_customer_analytics(loaded_datasets)
    segments = analytics["segments"]
    assert len(segments) == 5
    total_segmented = sum(s["customer_count"] for s in segments)
    assert total_segmented == 96096

def test_payment_analytics(loaded_datasets):
    analytics = analytics_engine.get_payment_analytics(loaded_datasets)
    assert len(analytics["payment_methods"]) >= 4
    assert analytics["payment_methods"][0]["payment_type"] == "Credit Card"

def test_review_analytics(loaded_datasets):
    analytics = analytics_engine.get_review_analytics(loaded_datasets)
    assert len(analytics["rating_distribution"]) == 5
    correl = analytics["delivery_csat_correlation"]
    assert "On Time / Early" in correl
    assert "Late" in correl
    assert correl["On Time / Early"]["avg_score"] > correl["Late"]["avg_score"]

def test_orders_table_pagination(loaded_datasets):
    table = analytics_engine.get_orders_table(loaded_datasets, page=1, page_size=20)
    assert table["total"] == 99441
    assert len(table["records"]) == 20
    assert "order_id" in table["records"][0]

def test_executive_insights(loaded_datasets):
    insights = analytics_engine.generate_executive_insights(loaded_datasets)
    assert len(insights) >= 3
    for ins in insights:
        assert "title" in ins
        assert "message" in ins

