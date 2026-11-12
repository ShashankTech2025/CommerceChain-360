"""
CommerceChain 360 - Metadata & System Route
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
import pandas as pd

from app.api.deps import get_datasets
from app.schemas.metadata import MetadataResponse, DateRange

router = APIRouter(prefix="/metadata", tags=["Metadata"])

@router.get("", response_model=MetadataResponse)
def get_metadata(datasets: Dict[str, pd.DataFrame] = Depends(get_datasets)) -> MetadataResponse:
    """
    Returns valid filter dimensions including date bounds, states, categories, and payment types.
    """
    df_orders = datasets["orders"]
    df_items = datasets["order_items"]
    df_customers = datasets["customers"]
    df_sellers = datasets["sellers"]
    df_payments = datasets["payments"]

    min_date = df_orders["order_purchase_date"].min().strftime("%Y-%m-%d")
    max_date = df_orders["order_purchase_date"].max().strftime("%Y-%m-%d")

    order_statuses = sorted([str(s) for s in df_orders["order_status"].dropna().unique()])
    customer_states = sorted([str(s) for s in df_customers["customer_state"].dropna().unique()])
    seller_states = sorted([str(s) for s in df_sellers["seller_state"].dropna().unique()])
    
    categories = sorted([
        str(c) for c in df_items["category_english"].dropna().unique() 
        if str(c) != "Uncategorized"
    ])
    
    payment_types = sorted([str(p) for p in df_payments["payment_type"].dropna().unique() if str(p) != "unknown"])
    review_scores = [1, 2, 3, 4, 5]

    total_orders = int(df_orders["order_id"].nunique())
    gross_sales = float(df_items["price"].sum())

    return MetadataResponse(
        date_range=DateRange(min_date=min_date, max_date=max_date),
        order_statuses=order_statuses,
        customer_states=customer_states,
        seller_states=seller_states,
        categories=categories,
        payment_types=payment_types,
        review_scores=review_scores,
        total_orders_baseline=total_orders,
        gross_sales_baseline=round(gross_sales, 2)
    )

