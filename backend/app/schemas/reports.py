"""
CommerceChain 360 - Reports & Order Explorer Schemas
"""

from typing import List, Optional
from pydantic import BaseModel

class OrderItemRecord(BaseModel):
    order_id: str
    customer_city: str
    customer_state: str
    order_status: str
    purchase_date: str
    items_count: int
    gross_sales: float
    freight: float
    delivery_sla_status: str
    review_score: Optional[float] = None

class OrdersTableResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    records: List[OrderItemRecord]

