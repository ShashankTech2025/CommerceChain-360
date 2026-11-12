"""
CommerceChain 360 - KPI Calculation Engine
Pure, robust calculation of business metrics across fact table grains with zero Cartesian inflation.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np

class MetricsEngine:
    @staticmethod
    def get_executive_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates the 6 master executive KPIs."""
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]
        df_customers = datasets["customers"]

        total_orders = int(df_orders["order_id"].nunique())
        delivered_orders = int((df_orders["order_status"] == "delivered").sum())
        gross_sales = float(df_items["price"].sum())
        
        # Calculate unique customers present in the filtered orders
        filtered_cust_ids = set(df_orders["customer_id"])
        unique_customers = int(df_customers.loc[df_customers["customer_id"].isin(filtered_cust_ids), "customer_unique_id"].nunique())
        
        aov = float(gross_sales / total_orders) if total_orders > 0 else 0.0

        # Delivery SLA metrics
        delivered_mask = (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].notna()
        delivered_with_dates = int(delivered_mask.sum())
        ontime_orders = int((delivered_mask & (df_orders["delivery_delay_days"] <= 0)).sum())
        ontime_rate = float(ontime_orders / delivered_with_dates * 100) if delivered_with_dates > 0 else 0.0

        return {
            "gross_item_sales": round(gross_sales, 2),
            "total_orders": total_orders,
            "delivered_orders": delivered_orders,
            "fulfillment_rate_pct": round(delivered_orders / total_orders * 100, 2) if total_orders > 0 else 0.0,
            "average_order_value": round(aov, 2),
            "unique_customers": unique_customers,
            "on_time_delivery_rate_pct": round(ontime_rate, 2),
            "delivered_with_dates": delivered_with_dates,
            "ontime_orders": ontime_orders
        }

    @staticmethod
    def get_sales_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates commercial sales intelligence KPIs."""
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]

        total_orders = int(df_orders["order_id"].nunique())
        units_sold = int(len(df_items))
        gross_sales = float(df_items["price"].sum())
        total_freight = float(df_items["freight_value"].sum())

        aov = float(gross_sales / total_orders) if total_orders > 0 else 0.0
        avg_item_price = float(gross_sales / units_sold) if units_sold > 0 else 0.0
        avg_items_per_order = float(units_sold / total_orders) if total_orders > 0 else 0.0

        # Delivered AOV
        delivered_order_ids = set(df_orders.loc[df_orders["order_status"] == "delivered", "order_id"])
        delivered_sales = float(df_items.loc[df_items["order_id"].isin(delivered_order_ids), "price"].sum())
        delivered_count = len(delivered_order_ids)
        delivered_aov = float(delivered_sales / delivered_count) if delivered_count > 0 else 0.0

        return {
            "gross_item_sales": round(gross_sales, 2),
            "total_orders": total_orders,
            "units_sold": units_sold,
            "average_order_value": round(aov, 2),
            "delivered_order_aov": round(delivered_aov, 2),
            "average_item_price": round(avg_item_price, 2),
            "average_items_per_order": round(avg_items_per_order, 2),
            "total_freight": round(total_freight, 2)
        }

    @staticmethod
    def get_customer_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates customer retention, frequency, and spend KPIs."""
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]
        df_customers = datasets["customers"]

        total_orders = int(df_orders["order_id"].nunique())
        gross_sales = float(df_items["price"].sum())

        # Link orders to unique customers
        cust_order_df = df_orders[["order_id", "customer_id"]].merge(
            df_customers[["customer_id", "customer_unique_id"]], on="customer_id", how="left"
        )
        orders_per_customer = cust_order_df.groupby("customer_unique_id")["order_id"].nunique()
        
        unique_customers = int(len(orders_per_customer))
        one_time_customers = int((orders_per_customer == 1).sum())
        repeat_customers = int((orders_per_customer > 1).sum())

        repeat_rate = float(repeat_customers / unique_customers * 100) if unique_customers > 0 else 0.0
        one_time_rate = float(one_time_customers / unique_customers * 100) if unique_customers > 0 else 0.0
        avg_customer_spend = float(gross_sales / unique_customers) if unique_customers > 0 else 0.0
        avg_orders_per_customer = float(total_orders / unique_customers) if unique_customers > 0 else 0.0

        return {
            "unique_customers": unique_customers,
            "repeat_customers": repeat_customers,
            "one_time_customers": one_time_customers,
            "repeat_customer_rate_pct": round(repeat_rate, 2),
            "one_time_customer_rate_pct": round(one_time_rate, 2),
            "average_customer_spend": round(avg_customer_spend, 2),
            "average_orders_per_customer": round(avg_orders_per_customer, 2)
        }

    @staticmethod
    def get_product_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates catalog and merchandise KPIs."""
        df_items = datasets["order_items"]
        df_products = datasets["products"]

        total_products_catalog = int(len(df_products))
        active_products_sold = int(df_items["product_id"].nunique())
        total_categories = int(df_items.loc[df_items["category_english"] != "Uncategorized", "category_english"].nunique())
        units_sold = int(len(df_items))
        gross_sales = float(df_items["price"].sum())
        total_freight = float(df_items["freight_value"].sum())

        avg_item_price = float(gross_sales / units_sold) if units_sold > 0 else 0.0
        freight_ratio = float(total_freight / gross_sales * 100) if gross_sales > 0 else 0.0

        return {
            "total_products_catalog": total_products_catalog,
            "active_products_sold": active_products_sold,
            "total_categories": total_categories,
            "units_sold": units_sold,
            "gross_item_sales": round(gross_sales, 2),
            "average_item_price": round(avg_item_price, 2),
            "total_freight": round(total_freight, 2),
            "freight_to_price_ratio_pct": round(freight_ratio, 2)
        }

    @staticmethod
    def get_logistics_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates supply chain fulfillment and SLA adherence KPIs."""
        df_orders = datasets["orders"]
        df_items = datasets["order_items"]

        total_freight = float(df_items["freight_value"].sum())
        total_orders = int(df_orders["order_id"].nunique())
        avg_freight_order = float(total_freight / total_orders) if total_orders > 0 else 0.0

        delivered_mask = (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].notna()
        delivered_with_dates = int(delivered_mask.sum())
        ontime_orders = int((delivered_mask & (df_orders["delivery_delay_days"] <= 0)).sum())
        late_orders = int((delivered_mask & (df_orders["delivery_delay_days"] > 0)).sum())

        ontime_rate = float(ontime_orders / delivered_with_dates * 100) if delivered_with_dates > 0 else 0.0
        late_rate = float(late_orders / delivered_with_dates * 100) if delivered_with_dates > 0 else 0.0

        avg_delivery_days = float(df_orders.loc[df_orders["delivery_days"].notna(), "delivery_days"].mean()) if delivered_with_dates > 0 else 0.0
        avg_estimated_days = float(df_orders["estimated_delivery_days"].mean()) if len(df_orders) > 0 else 0.0
        avg_delay_days = float(df_orders.loc[df_orders["delivery_delay_days"].notna(), "delivery_delay_days"].mean()) if delivered_with_dates > 0 else 0.0

        return {
            "total_freight": round(total_freight, 2),
            "average_freight_per_order": round(avg_freight_order, 2),
            "average_delivery_days": round(avg_delivery_days, 1),
            "average_estimated_delivery_days": round(avg_estimated_days, 1),
            "average_delivery_delay_days": round(avg_delay_days, 1),
            "delivered_with_dates": delivered_with_dates,
            "ontime_orders": ontime_orders,
            "late_orders": late_orders,
            "on_time_delivery_rate_pct": round(ontime_rate, 2),
            "late_delivery_rate_pct": round(late_rate, 2)
        }

    @staticmethod
    def get_payment_kpis(datasets: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """Calculates payment tender and CSAT review KPIs."""
        df_payments = datasets["payments"]
        df_reviews = datasets["reviews"]

        total_payments = float(df_payments["payment_value"].sum())
        total_transactions = int(len(df_payments))
        avg_payment = float(total_payments / total_transactions) if total_transactions > 0 else 0.0
        avg_installments = float(df_payments["payment_installments"].mean()) if total_transactions > 0 else 0.0

        total_reviews = int(len(df_reviews))
        avg_review = float(df_reviews["review_score"].mean()) if total_reviews > 0 else 0.0
        five_star_count = int((df_reviews["review_score"] == 5).sum())
        low_rating_count = int((df_reviews["review_score"].isin([1, 2])).sum())

        five_star_share = float(five_star_count / total_reviews * 100) if total_reviews > 0 else 0.0
        low_rating_share = float(low_rating_count / total_reviews * 100) if total_reviews > 0 else 0.0

        return {
            "total_recorded_payments": round(total_payments, 2),
            "total_payment_transactions": total_transactions,
            "average_payment_value": round(avg_payment, 2),
            "average_installments": round(avg_installments, 1),
            "total_reviews": total_reviews,
            "average_review_score": round(avg_review, 2),
            "five_star_reviews": five_star_count,
            "five_star_review_share_pct": round(five_star_share, 2),
            "low_rating_reviews": low_rating_count,
            "low_rating_review_share_pct": round(low_rating_share, 2)
        }

metrics_engine = MetricsEngine()
