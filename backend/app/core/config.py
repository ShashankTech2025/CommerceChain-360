import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"
CACHE_DIR = DATA_DIR / "cache"

# Application Settings
PROJECT_NAME = "CommerceChain 360"
API_V1_STR = "/api"
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://commercechain-360.pages.dev",
    "https://commercechain-360.vercel.app",
]

# Allow dynamic CORS from environment
extra_cors = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")
if extra_cors:
    for origin in extra_cors.split(","):
        o = origin.strip()
        if o and o not in CORS_ORIGINS:
            CORS_ORIGINS.append(o)


