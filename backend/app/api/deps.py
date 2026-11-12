"""
CommerceChain 360 - API Dependencies
Provides reusable dependency injection for dataset retrieval and grain-safe filtering.
"""

from typing import Dict, Any, Optional, List
from fastapi import Query, Depends
import pandas as pd

from app.services.data_loader import data_loader
from app.services.transformations import DataTransformer

def _parse_list_param(param: Optional[List[str]]) -> Optional[List[str]]:
    """Normalizes query parameters handling both repeat keys and comma-separated tokens."""
    if not param:
        return None
    tokens = []
    for item in param:
        if "," in item:
            tokens.extend([x.strip() for x in item.split(",") if x.strip()])
        else:
            if item.strip():
                tokens.append(item.strip())
    return tokens if tokens else None

def _parse_int_list_param(param: Optional[List[str]]) -> Optional[List[int]]:
    """Parses integer lists like review_score=5,4 or ?review_score=5&review_score=4."""
    if not param:
        return None
    raw_tokens = _parse_list_param(param)
    if not raw_tokens:
        return None
    int_tokens = []
    for token in raw_tokens:
        try:
            int_tokens.append(int(token))
        except ValueError:
            pass
    return int_tokens if int_tokens else None

def get_datasets() -> Dict[str, pd.DataFrame]:
    """Dependency returning all cached datasets from DataLoader singleton."""
    return data_loader.get_all()

def get_filter_params(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    order_status: Optional[List[str]] = Query(None, description="Order status filter (e.g. delivered, canceled)"),
    customer_state: Optional[List[str]] = Query(None, description="Customer state code filter (e.g. SP, RJ)"),
    seller_state: Optional[List[str]] = Query(None, description="Seller state code filter (e.g. SP, MG)"),
    category: Optional[List[str]] = Query(None, description="Product category filter (English name)"),
    payment_type: Optional[List[str]] = Query(None, description="Payment type filter (e.g. credit_card, boleto)"),
    review_score: Optional[List[str]] = Query(None, description="Review score filter (1 to 5)")
) -> Dict[str, Any]:
    """Extracts and normalizes multi-dimension filter query parameters."""
    return {
        "start_date": start_date if start_date and start_date.strip() else None,
        "end_date": end_date if end_date and end_date.strip() else None,
        "order_status": _parse_list_param(order_status),
        "customer_state": _parse_list_param(customer_state),
        "seller_state": _parse_list_param(seller_state),
        "category": _parse_list_param(category),
        "payment_type": _parse_list_param(payment_type),
        "review_score": _parse_int_list_param(review_score)
    }

def get_filtered_datasets(
    datasets: Dict[str, pd.DataFrame] = Depends(get_datasets),
    filters: Dict[str, Any] = Depends(get_filter_params)
) -> Dict[str, pd.DataFrame]:
    """
    Applies multi-grain intersection filtering across orders, items, payments, and reviews.
    Returns unmodified datasets if no filter criteria are provided.
    """
    has_active_filter = any(v is not None for v in filters.values())
    if not has_active_filter:
        return datasets

    return DataTransformer.filter_datasets(
        datasets=datasets,
        start_date=filters["start_date"],
        end_date=filters["end_date"],
        order_status=filters["order_status"],
        customer_state=filters["customer_state"],
        seller_state=filters["seller_state"],
        category=filters["category"],
        payment_type=filters["payment_type"],
        review_score=filters["review_score"]
    )

