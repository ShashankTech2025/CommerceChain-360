"""
CommerceChain 360 - Payments & Customer Experience Schemas
"""

from typing import List, Dict
from pydantic import BaseModel

class PaymentKPIsResponse(BaseModel):
    total_recorded_payments: float
    total_payment_transactions: int
    average_payment_value: float
    average_installments: float
    total_reviews: int
    average_review_score: float
    five_star_reviews: int
    five_star_review_share_pct: float
    low_rating_reviews: int
    low_rating_review_share_pct: float

class PaymentMethodItem(BaseModel):
    payment_type: str
    transactions: int
    total_value: float
    average_value: float
    value_share_pct: float

class InstallmentItem(BaseModel):
    installments: int
    transactions: int
    avg_value: float
    total_value: float

class PaymentAnalyticsResponse(BaseModel):
    payment_methods: List[PaymentMethodItem]
    installments: List[InstallmentItem]

class RatingDistItem(BaseModel):
    stars: int
    count: int
    percentage: float

class MonthlyCSATItem(BaseModel):
    month: str
    avg_score: float
    total_reviews: int

class CSATCorrelationItem(BaseModel):
    avg_score: float
    reviews: int

class ReviewAnalyticsResponse(BaseModel):
    rating_distribution: List[RatingDistItem]
    monthly_csat: List[MonthlyCSATItem]
    delivery_csat_correlation: Dict[str, CSATCorrelationItem]

