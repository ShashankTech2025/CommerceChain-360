"""
CommerceChain 360 - Customer Intelligence Schemas
"""

from typing import List
from pydantic import BaseModel

class CustomerKPIsResponse(BaseModel):
    unique_customers: int
    repeat_customers: int
    one_time_customers: int
    repeat_customer_rate_pct: float
    one_time_customer_rate_pct: float
    average_customer_spend: float
    average_orders_per_customer: float

class RFMSegmentItem(BaseModel):
    segment: str
    customer_count: int
    customer_share_pct: float
    avg_recency_days: float
    avg_frequency: float
    total_monetary: float
    avg_monetary: float

class FrequencyDistItem(BaseModel):
    order_count: int
    customer_count: int
    percentage: float

class CustomerAnalyticsResponse(BaseModel):
    segments: List[RFMSegmentItem]
    frequency_distribution: List[FrequencyDistItem]

