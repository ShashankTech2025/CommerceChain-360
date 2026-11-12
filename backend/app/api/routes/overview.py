"""
CommerceChain 360 - Executive Overview Routes
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.overview import (
    ExecutiveKPIsResponse,
    OverviewTrendsResponse,
    MonthlyTrendPoint,
    ExecutiveInsightsResponse,
    ExecutiveInsightItem
)

router = APIRouter(prefix="/overview", tags=["Executive Overview"])

@router.get("/kpis", response_model=ExecutiveKPIsResponse)
def get_executive_kpis(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> ExecutiveKPIsResponse:
    """Calculates top-level executive KPIs with grain-safe filtering."""
    kpis = metrics_engine.get_executive_kpis(filtered_datasets)
    return ExecutiveKPIsResponse(**kpis)

@router.get("/trends", response_model=OverviewTrendsResponse)
def get_overview_trends(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> OverviewTrendsResponse:
    """Calculates monthly gross sales and order volume trendlines."""
    trends = analytics_engine.get_monthly_trends(filtered_datasets)
    return OverviewTrendsResponse(trends=[MonthlyTrendPoint(**t) for t in trends])

@router.get("/insights", response_model=ExecutiveInsightsResponse)
def get_executive_insights(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> ExecutiveInsightsResponse:
    """Generates dynamic analytical commentary highlighting strategic business drivers."""
    insights = analytics_engine.generate_executive_insights(filtered_datasets)
    return ExecutiveInsightsResponse(insights=[ExecutiveInsightItem(**i) for i in insights])

