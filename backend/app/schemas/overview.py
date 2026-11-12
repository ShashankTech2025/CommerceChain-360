"""
CommerceChain 360 - Executive Overview Schemas
"""

from typing import List, Optional
from pydantic import BaseModel

class ExecutiveKPIsResponse(BaseModel):
    gross_item_sales: float
    total_orders: int
    delivered_orders: int
    fulfillment_rate_pct: float
    average_order_value: float
    unique_customers: int
    on_time_delivery_rate_pct: float
    delivered_with_dates: int
    ontime_orders: int

class MonthlyTrendPoint(BaseModel):
    month: str
    total_orders: int
    gross_item_sales: float
    average_order_value: float
    mom_sales_growth_pct: float
    mom_orders_growth_pct: float

class OverviewTrendsResponse(BaseModel):
    trends: List[MonthlyTrendPoint]

class ExecutiveInsightItem(BaseModel):
    type: str
    title: str
    message: str

class ExecutiveInsightsResponse(BaseModel):
    insights: List[ExecutiveInsightItem]

