"""
CommerceChain 360 - Enterprise FastAPI Backend Application
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import config
from app.services.data_loader import data_loader
from app.api.routes import (
    metadata_router,
    overview_router,
    sales_router,
    customers_router,
    products_router,
    logistics_router,
    payments_router,
    reviews_router,
    reports_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm analytical dataset caches
    try:
        data_loader.load_all()
    except Exception as e:
        print(f"[Warning] Startup pre-warm encountered: {e}")
    yield

app = FastAPI(
    title=config.PROJECT_NAME,
    description="Enterprise E-commerce Sales, Supply Chain & Delivery Intelligence Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Analytical Routers
app.include_router(metadata_router, prefix="/api")
app.include_router(overview_router, prefix="/api")
app.include_router(sales_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(logistics_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(reviews_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": config.PROJECT_NAME,
        "version": "1.0.0",
        "dataset_ready": data_loader.is_loaded
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {config.PROJECT_NAME} API",
        "docs": "/api/docs",
        "health": "/api/health"
    }
