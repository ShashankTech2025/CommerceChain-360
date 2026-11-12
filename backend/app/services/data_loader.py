"""
CommerceChain 360 - Analytical Data Loader Service
Optimized in-memory loading with Parquet caching and explicit typing.
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
import json

from app.core import config

class DataLoader:
    _instance: Optional["DataLoader"] = None
    _datasets: Dict[str, pd.DataFrame] = {}
    _loaded: bool = False

    def __new__(cls) -> "DataLoader":
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
        return cls._instance

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def load_all(self, force_reload: bool = False) -> Dict[str, pd.DataFrame]:
        """Loads all 9 datasets into optimized memory DataFrames with Parquet caching."""
        if self._loaded and not force_reload:
            return self._datasets

        data_dir = config.DATA_DIR
        cache_dir = config.CACHE_DIR
        cache_dir.mkdir(parents=True, exist_ok=True)

        print("[DataLoader] Initializing dataset loading...")

        # 1. Category Translations
        cat_file = data_dir / "category_translation_clean.csv"
        df_categories = pd.read_csv(cat_file, dtype={"product_category_name": "string", "product_category_name_english": "string"})
        cat_map = dict(zip(df_categories["product_category_name"], df_categories["product_category_name_english"].str.replace("_", " ").str.title()))
        cat_map["pc_gamer"] = "PC Gamer"
        cat_map["portateis_cozinha_e_preparadores_de_alimentos"] = "Kitchen Food Processors"
        cat_map["uncategorized"] = "Uncategorized"

        # 2. Customers
        cust_cache = cache_dir / "customers.parquet"
        if cust_cache.exists() and not force_reload:
            df_customers = pd.read_parquet(cust_cache)
        else:
            cust_file = data_dir / "customers_clean.csv"
            df_customers = pd.read_csv(
                cust_file,
                dtype={
                    "customer_id": "string",
                    "customer_unique_id": "string",
                    "customer_zip_code_prefix": "int32",
                    "customer_city": "string",
                    "customer_state": "category"
                }
            )
            df_customers["customer_city"] = df_customers["customer_city"].str.title()
            df_customers.to_parquet(cust_cache, index=False)

        # 3. Products
        prod_cache = cache_dir / "products.parquet"
        if prod_cache.exists() and not force_reload:
            df_products = pd.read_parquet(prod_cache)
        else:
            prod_file = data_dir / "products_clean.csv"
            df_products = pd.read_csv(
                prod_file,
                dtype={
                    "product_id": "string",
                    "product_category_name": "string",
                    "product_name_lenght": "float32",
                    "product_description_lenght": "float32",
                    "product_photos_qty": "float32",
                    "product_weight_g": "float32",
                    "product_length_cm": "float32",
                    "product_height_cm": "float32",
                    "product_width_cm": "float32",
                    "product_volume_cm3": "float32",
                    "dimensional_weight_kg": "float32"
                }
            )
            df_products["product_category_name"] = df_products["product_category_name"].fillna("uncategorized")
            df_products["category_english"] = df_products["product_category_name"].map(cat_map).fillna("Uncategorized")
            df_products.to_parquet(prod_cache, index=False)

        # 4. Sellers
        sell_cache = cache_dir / "sellers.parquet"
        if sell_cache.exists() and not force_reload:
            df_sellers = pd.read_parquet(sell_cache)
        else:
            sell_file = data_dir / "sellers_clean.csv"
            df_sellers = pd.read_csv(
                sell_file,
                dtype={
                    "seller_id": "string",
                    "seller_zip_code_prefix": "int32",
                    "seller_city": "string",
                    "seller_state": "category"
                }
            )
            df_sellers["seller_city"] = df_sellers["seller_city"].str.title()
            df_sellers.to_parquet(sell_cache, index=False)

        # 5. Orders
        ord_cache = cache_dir / "orders.parquet"
        if ord_cache.exists() and not force_reload:
            df_orders = pd.read_parquet(ord_cache)
        else:
            ord_file = data_dir / "orders_clean.csv"
            df_orders = pd.read_csv(
                ord_file,
                dtype={
                    "order_id": "string",
                    "customer_id": "string",
                    "order_status": "category",
                    "delivery_days": "float32",
                    "estimated_delivery_days": "float32",
                    "delivery_delay_days": "float32"
                },
                parse_dates=[
                    "order_purchase_timestamp",
                    "order_approved_at",
                    "order_delivered_carrier_date",
                    "order_delivered_customer_date",
                    "order_estimated_delivery_date"
                ]
            )
            df_orders["order_purchase_date"] = pd.to_datetime(df_orders["order_purchase_timestamp"].dt.date)
            df_orders["order_purchase_month"] = df_orders["order_purchase_timestamp"].dt.strftime("%Y-%m")
            
            # Standardize delivery SLA classification
            conditions = [
                (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].notna() & (df_orders["delivery_delay_days"] <= 0),
                (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].notna() & (df_orders["delivery_delay_days"] > 0),
                (df_orders["order_status"] == "delivered") & df_orders["delivery_delay_days"].isna()
            ]
            choices = ["On Time / Early", "Late", "Delivered (No SLA Date)"]
            df_orders["delivery_sla_status"] = np.select(conditions, choices, default="Undelivered")
            
            df_orders.to_parquet(ord_cache, index=False)

        # 6. Order Items
        items_cache = cache_dir / "order_items.parquet"
        if items_cache.exists() and not force_reload:
            df_items = pd.read_parquet(items_cache)
        else:
            items_file = data_dir / "order_items_clean.csv"
            df_items = pd.read_csv(
                items_file,
                dtype={
                    "order_id": "string",
                    "order_item_id": "int16",
                    "product_id": "string",
                    "seller_id": "string",
                    "price": "float64",
                    "freight_value": "float64",
                    "total_item_value": "float64"
                },
                parse_dates=["shipping_limit_date"]
            )
            # Add English category for fast item-level grouping
            prod_cat_lookup = dict(zip(df_products["product_id"], df_products["category_english"]))
            df_items["category_english"] = df_items["product_id"].map(prod_cat_lookup).fillna("Uncategorized")
            df_items.to_parquet(items_cache, index=False)

        # 7. Payments
        pay_cache = cache_dir / "payments.parquet"
        if pay_cache.exists() and not force_reload:
            df_payments = pd.read_parquet(pay_cache)
        else:
            pay_file = data_dir / "payments_clean.csv"
            df_payments = pd.read_csv(
                pay_file,
                dtype={
                    "order_id": "string",
                    "payment_sequential": "int16",
                    "payment_type": "category",
                    "payment_installments": "int16",
                    "payment_value": "float64"
                }
            )
            df_payments["payment_type"] = df_payments["payment_type"].astype(str).replace({"not_defined": "unknown"}).astype("category")
            df_payments.to_parquet(pay_cache, index=False)

        # 8. Reviews
        rev_cache = cache_dir / "reviews.parquet"
        if rev_cache.exists() and not force_reload:
            df_reviews = pd.read_parquet(rev_cache)
        else:
            rev_file = data_dir / "reviews_clean.csv"
            df_reviews = pd.read_csv(
                rev_file,
                dtype={
                    "review_id": "string",
                    "order_id": "string",
                    "review_score": "int8",
                    "review_comment_title": "string",
                    "review_comment_message": "string"
                },
                parse_dates=["review_creation_date", "review_answer_timestamp"]
            )
            df_reviews.to_parquet(rev_cache, index=False)

        # 9. Geolocation Centroids Cache
        centroids_file = cache_dir / "postal_centroids.json"
        if centroids_file.exists():
            with open(centroids_file, "r", encoding="utf-8") as f:
                centroids_data = json.load(f)
        else:
            centroids_data = {}

        self._datasets = {
            "orders": df_orders,
            "order_items": df_items,
            "payments": df_payments,
            "reviews": df_reviews,
            "customers": df_customers,
            "products": df_products,
            "sellers": df_sellers,
            "categories": df_categories,
            "category_map": cat_map,
            "postal_centroids": centroids_data
        }
        self._loaded = True
        print("[DataLoader] Successfully loaded and cached all 9 datasets.")
        return self._datasets

    def get(self, name: str) -> pd.DataFrame:
        """Retrieves a specific DataFrame by key name."""
        if not self._loaded:
            self.load_all()
        if name not in self._datasets:
            raise KeyError(f"Dataset '{name}' not found. Available: {list(self._datasets.keys())}")
        return self._datasets[name]

    def get_all(self) -> Dict[str, Any]:
        """Retrieves all loaded datasets."""
        if not self._loaded:
            return self.load_all()
        return self._datasets

data_loader = DataLoader()
