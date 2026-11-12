"""
CommerceChain 360 - Supply Chain & Logistics Schemas
"""

from typing import List
from pydantic import BaseModel

class LogisticsKPIsResponse(BaseModel):
    total_freight: float
    average_freight_per_order: float
    average_delivery_days: float
    average_estimated_delivery_days: float
    average_delivery_delay_days: float
    delivered_with_dates: int
    ontime_orders: int
    late_orders: int
    on_time_delivery_rate_pct: float
    late_delivery_rate_pct: float

class DelayBinItem(BaseModel):
    bin: str
    count: int
    percentage: float

class ActualVsEstimatedItem(BaseModel):
    month: str
    avg_delivery_days: float
    avg_estimated_days: float
    delivered_count: int

class StateSLAPerformanceItem(BaseModel):
    state: str
    delivered_orders: int
    avg_delivery_days: float
    ontime_orders: int
    late_orders: int
    on_time_rate_pct: float

class LogisticsAnalyticsResponse(BaseModel):
    delay_distribution: List[DelayBinItem]
    actual_vs_estimated: List[ActualVsEstimatedItem]
    state_sla: List[StateSLAPerformanceItem]

class DistributionItem(BaseModel):
    status: str
    count: int
    percentage: float

