"""
CommerceChain 360 - Sales Intelligence Schemas
"""

from typing import List
from pydantic import BaseModel
from app.schemas.overview import MonthlyTrendPoint

class SalesKPIsResponse(BaseModel):
    gross_item_sales: float
    total_orders: int
    units_sold: int
    average_order_value: float
    delivered_order_aov: float
    average_item_price: float
    average_items_per_order: float
    total_freight: float

class CategoryPerformanceItem(BaseModel):
    category: str
    gross_item_sales: float
    units_sold: int
    total_freight: float
    average_item_price: float
    freight_to_price_ratio_pct: float
    sales_share_pct: float
    cumulative_share_pct: float

class CategoryPerformanceResponse(BaseModel):
    top_10: List[CategoryPerformanceItem]
    bottom_10: List[CategoryPerformanceItem]
    all_categories: List[CategoryPerformanceItem]

class RegionalSalesItem(BaseModel):
    state: str
    gross_item_sales: float
    total_orders: int
    unique_customers: int
    average_order_value: float
    sales_share_pct: float

class RegionalSalesResponse(BaseModel):
    regions: List[RegionalSalesItem]

