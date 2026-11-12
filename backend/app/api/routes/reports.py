"""
CommerceChain 360 - Reports & Order Explorer Routes
"""

from typing import Dict, Any, Optional
import io
import pandas as pd
from fastapi import APIRouter, Depends, Query, Response
from fastapi.responses import StreamingResponse

from app.api.deps import get_filtered_datasets
from app.services.analytics import analytics_engine
from app.schemas.reports import OrdersTableResponse

router = APIRouter(prefix="/reports", tags=["Data Explorer & Reports"])

@router.get("/orders", response_model=OrdersTableResponse)
def get_orders_table(
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search across order ID, customer city, and state"),
    sort_by: str = Query("order_purchase_timestamp", description="Sort field name"),
    sort_desc: bool = Query(True, description="Sort descending"),
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
) -> OrdersTableResponse:
    """Provides a paginated, searchable, sorted table of order records."""
    table_data = analytics_engine.get_orders_table(
        datasets=filtered_datasets,
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_desc=sort_desc
    )
    return OrdersTableResponse(**table_data)

@router.get("/export")
def export_orders_data(
    format: str = Query("csv", pattern="^(csv|json)$", description="Export format: 'csv' or 'json'"),
    search: Optional[str] = Query(None, description="Optional search filter"),
    sort_by: str = Query("order_purchase_timestamp", description="Sort field name"),
    sort_desc: bool = Query(True, description="Sort descending"),
    limit: int = Query(10000, ge=1, le=50000, description="Maximum rows to export"),
    filtered_datasets: Dict[str, pd.DataFrame] = Depends(get_filtered_datasets)
):
    """Streams an export of filtered order records as CSV or JSON."""
    table_data = analytics_engine.get_orders_table(
        datasets=filtered_datasets,
        page=1,
        page_size=limit,
        search=search,
        sort_by=sort_by,
        sort_desc=sort_desc
    )
    records = table_data["records"]

    if format == "csv":
        df = pd.DataFrame(records)
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=commercechain_orders_export.csv"}
        )
    else:
        df = pd.DataFrame(records)
        json_str = df.to_json(orient="records", date_format="iso")
        return Response(
            content=json_str,
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=commercechain_orders_export.json"}
        )

