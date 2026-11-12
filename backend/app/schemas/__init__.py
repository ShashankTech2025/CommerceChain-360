"""
CommerceChain 360 - Schemas Package
"""

from app.schemas.common import FilterParams, PaginationParams, StatusResponse
from app.schemas.metadata import MetadataResponse, DateRange
from app.schemas.overview import (
    ExecutiveKPIsResponse,
    MonthlyTrendPoint,
    OverviewTrendsResponse,
    ExecutiveInsightItem,
    ExecutiveInsightsResponse
)
from app.schemas.sales import (
    SalesKPIsResponse,
    CategoryPerformanceItem,
    CategoryPerformanceResponse,
    RegionalSalesItem,
    RegionalSalesResponse
)
from app.schemas.customers import (
    CustomerKPIsResponse,
    RFMSegmentItem,
    FrequencyDistItem,
    CustomerAnalyticsResponse
)
from app.schemas.products import ProductKPIsResponse
from app.schemas.logistics import (
    LogisticsKPIsResponse,
    DelayBinItem,
    ActualVsEstimatedItem,
    StateSLAPerformanceItem,
    LogisticsAnalyticsResponse,
    DistributionItem
)
from app.schemas.payments import (
    PaymentKPIsResponse,
    PaymentMethodItem,
    InstallmentItem,
    PaymentAnalyticsResponse,
    RatingDistItem,
    MonthlyCSATItem,
    CSATCorrelationItem,
    ReviewAnalyticsResponse
)
from app.schemas.reports import OrderItemRecord, OrdersTableResponse
