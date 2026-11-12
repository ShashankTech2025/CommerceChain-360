"""
CommerceChain 360 - Analytical Transformations & Grain-Safe Filtering
Provides vectorized transformations, RFM segmentation, and multi-grain filtering.
"""

from typing import Dict, Any, Optional, List, Set
import pandas as pd
import numpy as np
from datetime import datetime

class DataTransformer:
    @staticmethod
    def filter_datasets(
        datasets: Dict[str, pd.DataFrame],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        order_status: Optional[List[str]] = None,
        customer_state: Optional[List[str]] = None,
        seller_state: Optional[List[str]] = None,
        category: Optional[List[str]] = None,
        payment_type: Optional[List[str]] = None,
        review_score: Optional[List[int]] = None
    ) -> Dict[str, pd.DataFrame]:
        """
        Filters all datasets simultaneously while preserving individual table grain.
        Computes intersection of qualifying order IDs to prevent Cartesian product inflation.
        """
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]
        df_payments = datasets["payments"]
        df_reviews = datasets["reviews"]
        df_customers = datasets["customers"]
        df_sellers = datasets["sellers"]

        order_filter_sets: List[Set[str]] = []

        # 1. Date Range Filter
        if start_date or end_date:
            date_mask = pd.Series(True, index=df_orders.index)
            if start_date:
                date_mask &= (df_orders["order_purchase_date"] >= pd.to_datetime(start_date))
            if end_date:
                date_mask &= (df_orders["order_purchase_date"] <= pd.to_datetime(end_date))
            order_filter_sets.append(set(df_orders.loc[date_mask, "order_id"]))

        # 2. Order Status Filter
        if order_status:
            status_mask = df_orders["order_status"].isin(order_status)
            order_filter_sets.append(set(df_orders.loc[status_mask, "order_id"]))

        # 3. Customer State Filter
        if customer_state:
            valid_cust_ids = set(df_customers.loc[df_customers["customer_state"].isin(customer_state), "customer_id"])
            order_filter_sets.append(set(df_orders.loc[df_orders["customer_id"].isin(valid_cust_ids), "order_id"]))

        # 4. Product Category Filter
        if category:
            cat_mask = df_items["category_english"].isin(category)
            order_filter_sets.append(set(df_items.loc[cat_mask, "order_id"]))

        # 5. Seller State Filter
        if seller_state:
            valid_seller_ids = set(df_sellers.loc[df_sellers["seller_state"].isin(seller_state), "seller_id"])
            seller_item_mask = df_items["seller_id"].isin(valid_seller_ids)
            order_filter_sets.append(set(df_items.loc[seller_item_mask, "order_id"]))

        # 6. Payment Type Filter
        if payment_type:
            pay_mask = df_payments["payment_type"].isin(payment_type)
            order_filter_sets.append(set(df_payments.loc[pay_mask, "order_id"]))

        # 7. Review Score Filter
        if review_score:
            rev_mask = df_reviews["review_score"].isin(review_score)
            order_filter_sets.append(set(df_reviews.loc[rev_mask, "order_id"]))

        # Intersect qualifying order IDs
        if order_filter_sets:
            qualifying_orders = set.intersection(*order_filter_sets)
            filtered_orders = df_orders[df_orders["order_id"].isin(qualifying_orders)]
            filtered_items = df_items[df_items["order_id"].isin(qualifying_orders)]
            filtered_payments = df_payments[df_payments["order_id"].isin(qualifying_orders)]
            filtered_reviews = df_reviews[df_reviews["order_id"].isin(qualifying_orders)]
        else:
            filtered_orders = df_orders
            filtered_items = df_items
            filtered_payments = df_payments
            filtered_reviews = df_reviews

        return {
            "orders": filtered_orders,
            "order_items": filtered_items,
            "payments": filtered_payments,
            "reviews": filtered_reviews,
            "customers": df_customers,
            "products": datasets["products"],
            "sellers": df_sellers,
            "categories": datasets["categories"],
            "category_map": datasets["category_map"],
            "postal_centroids": datasets["postal_centroids"]
        }

    @staticmethod
    def calculate_rfm_segments(df_orders: pd.DataFrame, df_items: pd.DataFrame, df_customers: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates customer RFM metrics and assigns segments based on transparent quantiles.
        Aggregates at customer_unique_id grain.
        """
        # Order items gross sales per order
        order_sales = df_items.groupby("order_id", as_index=False)["price"].sum()
        order_sales.rename(columns={"price": "order_gross_sales"}, inplace=True)

        merged = df_orders[["order_id", "customer_id", "order_purchase_timestamp"]].merge(
            order_sales, on="order_id", how="left"
        ).merge(
            df_customers[["customer_id", "customer_unique_id"]], on="customer_id", how="left"
        )
        merged["order_gross_sales"] = merged["order_gross_sales"].fillna(0.0)

        # Fixed reference date 1 day after dataset maximum purchase date
        ref_date = merged["order_purchase_timestamp"].max() + pd.Timedelta(days=1)

        rfm = merged.groupby("customer_unique_id").agg(
            last_purchase=("order_purchase_timestamp", "max"),
            frequency=("order_id", "nunique"),
            monetary=("order_gross_sales", "sum")
        ).reset_index()
        rfm["recency_days"] = (ref_date - rfm["last_purchase"]).dt.days

        # Dynamic RFM Scoring
        # Recency: Lower is better (score 5 is most recent)
        rfm["R_score"] = pd.qcut(rfm["recency_days"].rank(method="first"), 5, labels=[5, 4, 3, 2, 1]).astype(int)
        # Frequency: Higher is better (score 5 is most frequent)
        rfm["F_score"] = pd.qcut(rfm["frequency"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
        # Monetary: Higher is better (score 5 is highest spend)
        rfm["M_score"] = pd.qcut(rfm["monetary"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)

        conditions = [
            (rfm["R_score"] >= 4) & (rfm["F_score"] >= 4),
            (rfm["R_score"] >= 3) & (rfm["F_score"] >= 3),
            (rfm["R_score"] <= 2) & (rfm["F_score"] >= 3),
            (rfm["R_score"] <= 2) & (rfm["F_score"] <= 2)
        ]
        segments = [
            "Loyal / Best Customers",
            "Potential Loyalists",
            "At Risk",
            "Inactive / Low Engagement"
        ]
        rfm["customer_segment"] = np.select(conditions, segments, default="Regular Customers")
        return rfm
