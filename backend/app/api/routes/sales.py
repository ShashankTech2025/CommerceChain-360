"""
CommerceChain 360 - Sales Intelligence Routes
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.overview import MonthlyTrendPoint
from app.schemas.sales import (
    SalesKPIsResponse,
    CategoryPerformanceResponse,
    RegionalSalesResponse,
    RegionalSalesItem
)

router = APIRouter(prefix="/sales", tags=["Sales Intelligence"])

@router.get("/summary", response_model=SalesKPIsResponse)
def get_sales_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> SalesKPIsResponse:
    """Calculates commercial sales intelligence KPIs."""
    kpis = metrics_engine.get_sales_kpis(filtered_datasets)
    return SalesKPIsResponse(**kpis)

@router.get("/monthly", response_model=List[MonthlyTrendPoint])
def get_sales_monthly(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> List[MonthlyTrendPoint]:
    """Calculates monthly sales trend, volume, and MoM growth rates."""
    trends = analytics_engine.get_monthly_trends(filtered_datasets)
    return [MonthlyTrendPoint(**t) for t in trends]

@router.get("/categories", response_model=CategoryPerformanceResponse)
def get_sales_categories(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> CategoryPerformanceResponse:
    """Calculates category rankings, revenue share, and freight ratios."""
    cats = analytics_engine.get_category_performance(filtered_datasets)
    return CategoryPerformanceResponse(**cats)

@router.get("/regions", response_model=RegionalSalesResponse)
def get_sales_regions(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> RegionalSalesResponse:
    """Calculates state-level sales, orders, unique customers, and AOV."""
    regions = analytics_engine.get_regional_sales(filtered_datasets)
    return RegionalSalesResponse(regions=[RegionalSalesItem(**r) for r in regions])

