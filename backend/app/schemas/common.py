"""
CommerceChain 360 - Common Schemas & Filter Models
"""

from typing import Optional, List
from pydantic import BaseModel, Field

class FilterParams(BaseModel):
    start_date: Optional[str] = Field(None, description="Start purchase date (YYYY-MM-DD)")
    end_date: Optional[str] = Field(None, description="End purchase date (YYYY-MM-DD)")
    order_status: Optional[List[str]] = Field(None, description="List of order statuses")
    customer_state: Optional[List[str]] = Field(None, description="List of customer state codes")
    seller_state: Optional[List[str]] = Field(None, description="List of seller state codes")
    category: Optional[List[str]] = Field(None, description="List of English product categories")
    payment_type: Optional[List[str]] = Field(None, description="List of payment methods")
    review_score: Optional[List[int]] = Field(None, description="List of review star scores (1-5)")

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    search: Optional[str] = Field(None, description="Search term across orders, cities, states")
    sort_by: str = Field("order_purchase_timestamp", description="Column to sort by")
    sort_desc: bool = Field(True, description="Sort descending if true")

class StatusResponse(BaseModel):
    status: str
    message: str

