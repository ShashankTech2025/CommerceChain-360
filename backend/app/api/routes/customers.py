"""
CommerceChain 360 - Customer Intelligence Routes
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.customers import (
    CustomerKPIsResponse,
    CustomerAnalyticsResponse
)

router = APIRouter(prefix="/customers", tags=["Customer Intelligence"])

@router.get("/summary", response_model=CustomerKPIsResponse)
def get_customers_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> CustomerKPIsResponse:
    """Calculates customer retention, repeat rates, and average spend."""
    kpis = metrics_engine.get_customer_kpis(filtered_datasets)
    return CustomerKPIsResponse(**kpis)

@router.get("/segments", response_model=CustomerAnalyticsResponse)
def get_customers_segments(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> CustomerAnalyticsResponse:
    """Calculates RFM segmentation cohorts and purchase frequency distribution."""
    analytics = analytics_engine.get_customer_analytics(filtered_datasets)
    return CustomerAnalyticsResponse(**analytics)

