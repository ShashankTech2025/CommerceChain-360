"""
CommerceChain 360 - API Routes Package
"""

from app.api.routes.metadata import router as metadata_router
from app.api.routes.overview import router as overview_router
from app.api.routes.sales import router as sales_router
from app.api.routes.customers import router as customers_router
from app.api.routes.products import router as products_router
from app.api.routes.logistics import router as logistics_router
from app.api.routes.payments import router as payments_router, reviews_router
from app.api.routes.reports import router as reports_router

__all__ = [
    "metadata_router",
    "overview_router",
    "sales_router",
    "customers_router",
    "products_router",
    "logistics_router",
    "payments_router",
    "reviews_router",
    "reports_router",
]
