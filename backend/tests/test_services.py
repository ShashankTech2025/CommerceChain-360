import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
import pandas as pd
from app.services.data_loader import data_loader
from app.services.data_validation import DataValidator
from app.services.transformations import DataTransformer

@pytest.fixture(scope="session")
def loaded_datasets():
    return data_loader.load_all()

def test_data_loader_counts(loaded_datasets):
    assert len(loaded_datasets["orders"]) == 99441
    assert len(loaded_datasets["order_items"]) == 112650
    assert len(loaded_datasets["payments"]) == 103886
    assert len(loaded_datasets["reviews"]) == 99224
    assert len(loaded_datasets["customers"]) == 99441
    assert len(loaded_datasets["products"]) == 32951
    assert len(loaded_datasets["sellers"]) == 3095

def test_data_validation_shapes(loaded_datasets):
    result = DataValidator.validate_dataset_shapes(loaded_datasets)
    assert result["all_passed"] is True

def test_data_validation_metrics(loaded_datasets):
    result = DataValidator.validate_business_metrics(loaded_datasets)
    assert result["all_passed"] is True
    metrics = result["metrics"]
    assert metrics["total_orders"]["actual"] == 99441
    assert metrics["delivered_orders"]["actual"] == 96478
    assert metrics["gross_item_sales"]["actual"] == 13591643.70
    assert metrics["total_payments"]["actual"] == 16008872.12
    assert metrics["unique_customers"]["actual"] == 96096
    assert metrics["ontime_rate_pct"]["diff"] < 0.01
    assert metrics["late_rate_pct"]["diff"] < 0.01

def test_data_validation_referential_integrity(loaded_datasets):
    result = DataValidator.validate_referential_integrity(loaded_datasets)
    assert result["all_passed"] is True
    for key, count in result["details"].items():
        assert count == 0, f"Referential integrity failure on {key}: {count} unmatched"

def test_transformer_delivered_status_filter(loaded_datasets):
    filtered = DataTransformer.filter_datasets(loaded_datasets, order_status=["delivered"])
    assert len(filtered["orders"]) == 96478
    assert (filtered["orders"]["order_status"] == "delivered").all()

def test_transformer_date_filter(loaded_datasets):
    filtered = DataTransformer.filter_datasets(loaded_datasets, start_date="2017-01-01", end_date="2017-12-31")
    assert len(filtered["orders"]) > 0
    assert (filtered["orders"]["order_purchase_date"] >= pd.to_datetime("2017-01-01")).all()
    assert (filtered["orders"]["order_purchase_date"] <= pd.to_datetime("2017-12-31")).all()

def test_transformer_rfm_segments(loaded_datasets):
    rfm = DataTransformer.calculate_rfm_segments(
        loaded_datasets["orders"],
        loaded_datasets["order_items"],
        loaded_datasets["customers"]
    )
    assert len(rfm) == 96096
    expected_segments = {
        "Loyal / Best Customers",
        "Potential Loyalists",
        "Regular Customers",
        "At Risk",
        "Inactive / Low Engagement"
    }
    actual_segments = set(rfm["customer_segment"].unique())
    assert actual_segments == expected_segments

