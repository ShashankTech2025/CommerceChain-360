"""
CommerceChain 360 - Supply Chain & Logistics Routes
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.logistics import (
    LogisticsKPIsResponse,
    LogisticsAnalyticsResponse,
    DistributionItem
)

router = APIRouter(prefix="/logistics", tags=["Supply Chain & Logistics"])

@router.get("/summary", response_model=LogisticsKPIsResponse)
def get_logistics_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> LogisticsKPIsResponse:
    """Calculates supply chain fulfillment and SLA adherence KPIs."""
    kpis = metrics_engine.get_logistics_kpis(filtered_datasets)
    return LogisticsKPIsResponse(**kpis)

@router.get("/delays", response_model=LogisticsAnalyticsResponse)
def get_logistics_delays(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> LogisticsAnalyticsResponse:
    """Calculates delivery delay histograms, actual vs estimated days, and state SLA performance."""
    analytics = analytics_engine.get_logistics_analytics(filtered_datasets)
    return LogisticsAnalyticsResponse(**analytics)

@router.get("/order-status", response_model=List[DistributionItem])
def get_order_status_distribution(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> List[DistributionItem]:
    """Returns order status breakdown percentages."""
    dist = analytics_engine.get_order_status_distribution(filtered_datasets)
    return [DistributionItem(**d) for d in dist]

@router.get("/sla-status", response_model=List[DistributionItem])
def get_delivery_sla_distribution(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> List[DistributionItem]:
    """Returns delivery SLA status breakdown percentages."""
    dist = analytics_engine.get_delivery_sla_distribution(filtered_datasets)
    return [DistributionItem(**d) for d in dist]

