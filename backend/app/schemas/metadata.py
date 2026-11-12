"""
CommerceChain 360 - Metadata Schemas
"""

from typing import List, Dict
from pydantic import BaseModel

class DateRange(BaseModel):
    min_date: str
    max_date: str

class MetadataResponse(BaseModel):
    date_range: DateRange
    order_statuses: List[str]
    customer_states: List[str]
    seller_states: List[str]
    categories: List[str]
    payment_types: List[str]
    review_scores: List[int]
    total_orders_baseline: int
    gross_sales_baseline: float

