"""
CommerceChain 360 - Product & Merchandise Schemas
"""

from typing import List
from pydantic import BaseModel
from app.schemas.sales import CategoryPerformanceItem, CategoryPerformanceResponse

class ProductKPIsResponse(BaseModel):
    total_products_catalog: int
    active_products_sold: int
    total_categories: int
    units_sold: int
    gross_item_sales: float
    average_item_price: float
    total_freight: float
    freight_to_price_ratio_pct: float

