"""
CommerceChain 360 - Analytical Cache & Pre-Aggregates Generator
Usage: python scripts/prepare_aggregates.py
Purpose: Pre-computes monthly trends, regional summaries, category metrics, and postal centroids
"""

import os
import sys
import csv
import json
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "processed"
CACHE_DIR = DATA_DIR / "cache"

def generate_aggregates():
    print("=" * 70)
    print("COMMERCECHAIN 360 - GENERATING ANALYTICAL AGGREGATES")
    print("=" * 70)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Zip Code Centroids (Compresses 738,332 rows into 19,015 clean centroids)
    print("1. Aggregating Geolocation coordinates to Postal Centroids...")
    geo_path = DATA_DIR / "geolocation_clean.csv"
    geo_agg = defaultdict(lambda: {"lat_sum": 0.0, "lng_sum": 0.0, "count": 0, "city": "", "state": ""})
    
    with open(geo_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            zip_code = int(r["geolocation_zip_code_prefix"])
            lat = float(r["geolocation_lat"])
            lng = float(r["geolocation_lng"])
            entry = geo_agg[zip_code]
            entry["lat_sum"] += lat
            entry["lng_sum"] += lng
            entry["count"] += 1
            if not entry["city"]:
                entry["city"] = r["geolocation_city"].strip().title()
                entry["state"] = r["geolocation_state"].strip().upper()

    centroids = {}
    for z, data in geo_agg.items():
        centroids[z] = {
            "lat": round(data["lat_sum"] / data["count"], 5),
            "lng": round(data["lng_sum"] / data["count"], 5),
            "city": data["city"],
            "state": data["state"]
        }

    with open(CACHE_DIR / "postal_centroids.json", "w", encoding="utf-8") as f:
        json.dump(centroids, f)
    print(f"   -> Saved {len(centroids)} postal centroids to cache/postal_centroids.json")

    # 2. English Category Translation Map with Fallback
    print("2. Mapping English Product Categories...")
    cat_path = DATA_DIR / "category_translation_clean.csv"
    cat_map = {}
    with open(cat_path, "r", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            cat_map[r["product_category_name"]] = r["product_category_name_english"].replace("_", " ").title()

    # Known Olist edge cases
    cat_map["pc_gamer"] = "PC Gamer"
    cat_map["portateis_cozinha_e_preparadores_de_alimentos"] = "Kitchen Food Processors"
    cat_map["uncategorized"] = "Uncategorized"

    with open(CACHE_DIR / "category_translations.json", "w", encoding="utf-8") as f:
        json.dump(cat_map, f, indent=2)
    print(f"   -> Saved {len(cat_map)} category translations to cache/category_translations.json")

    print("\nPre-aggregation completed successfully.")
    return 0

if __name__ == "__main__":
    sys.exit(generate_aggregates())

