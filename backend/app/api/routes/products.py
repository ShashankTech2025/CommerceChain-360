"""
CommerceChain 360 - Product & Catalog Intelligence Routes
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_filtered_datasets
from app.services.metrics import metrics_engine
from app.services.analytics import analytics_engine
from app.schemas.products import ProductKPIsResponse
from app.schemas.sales import CategoryPerformanceResponse

router = APIRouter(prefix="/products", tags=["Product Intelligence"])

@router.get("/summary", response_model=ProductKPIsResponse)
def get_products_summary(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> ProductKPIsResponse:
    """Calculates catalog size, active items, unit price, and freight ratios."""
    kpis = metrics_engine.get_product_kpis(filtered_datasets)
    return ProductKPIsResponse(**kpis)

@router.get("/categories", response_model=CategoryPerformanceResponse)
def get_products_categories(
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> CategoryPerformanceResponse:
    """Calculates top and bottom performing product categories."""
    cats = analytics_engine.get_category_performance(filtered_datasets)
    return CategoryPerformanceResponse(**cats)

