"""
CommerceChain 360 - Payments & CSAT Review Routes
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.payments import (
    PaymentKPIsResponse,
    PaymentAnalyticsResponse,
    ReviewAnalyticsResponse
)

router = APIRouter(prefix="/payments", tags=["Payments & Financing"])
reviews_router = APIRouter(prefix="/reviews", tags=["Customer Experience & Reviews"])

@router.get("/summary", response_model=PaymentKPIsResponse)
def get_payments_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> PaymentKPIsResponse:
    """Calculates payment tender volume, transactions, and CSAT scores."""
    kpis = metrics_engine.get_payment_kpis(filtered_datasets)
    return PaymentKPIsResponse(**kpis)

@router.get("/methods", response_model=PaymentAnalyticsResponse)
def get_payment_methods(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> PaymentAnalyticsResponse:
    """Calculates payment method market share and installment distributions."""
    analytics = analytics_engine.get_payment_analytics(filtered_datasets)
    return PaymentAnalyticsResponse(**analytics)

@reviews_router.get("/summary", response_model=ReviewAnalyticsResponse)
def get_reviews_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> ReviewAnalyticsResponse:
    """Calculates review score distribution, monthly CSAT trend, and SLA correlation."""
    analytics = analytics_engine.get_review_analytics(filtered_datasets)
    return ReviewAnalyticsResponse(**analytics)

