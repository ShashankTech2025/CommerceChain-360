"""
CommerceChain 360 - Data Validation Service
Verifies dataset integrity, schema conformance, and reconciles core business metrics.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np

class DataValidator:
    EXPECTED_COUNTS = {
        "orders": 99441,
        "order_items": 112650,
        "payments": 103886,
        "reviews": 99224,
        "customers": 99441,
        "products": 32951,
        "sellers": 3095
    }

    BENCHMARK_KPIS = {
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
        "avg_review_score": 4.0864
    }

    @classmethod
    def validate_dataset_shapes(cls, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Validates that loaded DataFrames match exact expected row counts."""
        shape_results = {}
        all_passed = True
        
        for table, expected_rows in cls.EXPECTED_COUNTS.items():
            if table not in datasets:
                shape_results[table] = {"status": "MISSING", "actual": 0, "expected": expected_rows}
                all_passed = False
                continue
            actual_rows = len(datasets[table])
            passed = actual_rows == expected_rows
            if not passed:
                all_passed = False
            shape_results[table] = {
                "status": "PASS" if passed else "FAIL",
                "actual": actual_rows,
                "expected": expected_rows
            }
            
        return {"all_passed": all_passed, "details": shape_results}

    @classmethod
    def validate_business_metrics(cls, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Validates that calculated metrics match verified EDA benchmarks with zero variance."""
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]
        df_payments = datasets["payments"]
        df_reviews = datasets["reviews"]
        df_customers = datasets["customers"]

        total_orders = int(df_orders["order_id"].nunique())
        delivered_orders = int((df_orders["order_status"] == "delivered").sum())
        gross_sales = float(df_items["price"].sum())
        total_freight = float(df_items["freight_value"].sum())
        total_payments = float(df_payments["payment_value"].sum())
        unique_customers = int(df_customers["customer_unique_id"].nunique())
        aov = float(gross_sales / total_orders) if total_orders else 0.0

        delivered_mask = (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].notna()
        delivered_with_dates = int(delivered_mask.sum())
        ontime_orders = int((delivered_mask & (df_orders["delivery_delay_days"] <= 0)).sum())
        late_orders = int((delivered_mask & (df_orders["delivery_delay_days"] > 0)).sum())
        ontime_rate = float(ontime_orders / delivered_with_dates * 100) if delivered_with_dates else 0.0
        late_rate = float(late_orders / delivered_with_dates * 100) if delivered_with_dates else 0.0
        avg_review = float(df_reviews["review_score"].mean()) if len(df_reviews) else 0.0

        actuals = {
            "total_orders": total_orders,
            "delivered_orders": delivered_orders,
            "gross_item_sales": round(gross_sales, 2),
            "total_freight": round(total_freight, 2),
            "total_payments": round(total_payments, 2),
            "unique_customers": unique_customers,
            "aov": round(aov, 4),
            "delivered_with_dates": delivered_with_dates,
            "ontime_orders": ontime_orders,
            "late_orders": late_orders,
            "ontime_rate_pct": round(ontime_rate, 4),
            "late_rate_pct": round(late_rate, 4),
            "avg_review_score": round(avg_review, 4)
        }

        comparison = {}
        all_passed = True
        for k, benchmark in cls.BENCHMARK_KPIS.items():
            act = actuals[k]
            diff = abs(act - benchmark)
            passed = diff < 0.01
            if not passed:
                all_passed = False
            comparison[k] = {
                "benchmark": benchmark,
                "actual": act,
                "diff": round(diff, 4),
                "status": "PASS" if passed else "FAIL"
            }

        return {
            "all_passed": all_passed,
            "metrics": comparison
        }

    @classmethod
    def validate_referential_integrity(cls, datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Validates that foreign keys between all tables have 100% referential integrity."""
        orders_ids = set(datasets["orders"]["order_id"])
        customers_ids = set(datasets["customers"]["customer_id"])
        products_ids = set(datasets["products"]["product_id"])
        sellers_ids = set(datasets["sellers"]["seller_id"])

        unmatched_orders_cust = len(set(datasets["orders"]["customer_id"]) - customers_ids)
        unmatched_items_orders = len(set(datasets["order_items"]["order_id"]) - orders_ids)
        unmatched_items_prod = len(set(datasets["order_items"]["product_id"]) - products_ids)
        unmatched_items_sell = len(set(datasets["order_items"]["seller_id"]) - sellers_ids)
        unmatched_pay_orders = len(set(datasets["payments"]["order_id"]) - orders_ids)
        unmatched_rev_orders = len(set(datasets["reviews"]["order_id"]) - orders_ids)

        all_passed = (
            unmatched_orders_cust == 0 and
            unmatched_items_orders == 0 and
            unmatched_items_prod == 0 and
            unmatched_items_sell == 0 and
            unmatched_pay_orders == 0 and
            unmatched_rev_orders == 0
        )

        return {
            "all_passed": all_passed,
            "details": {
                "orders_customer_id_in_customers": unmatched_orders_cust,
                "order_items_order_id_in_orders": unmatched_items_orders,
                "order_items_product_id_in_products": unmatched_items_prod,
                "order_items_seller_id_in_sellers": unmatched_items_sell,
                "payments_order_id_in_orders": unmatched_pay_orders,
                "reviews_order_id_in_orders": unmatched_rev_orders
            }
        }

