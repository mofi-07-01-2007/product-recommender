from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "products.json", "r", encoding="utf-8") as file:
    products = json.load(file)

@app.get("/")
def home():
    return {"message": "Product Recommendation API is running!"}


@app.get("/products")
def get_products():
    return products


@app.get("/recommend")
def recommend(
    category: str,
    budget: float,
    spec: str = ""
):
    # 1. Filter by category
    filtered = [
        product for product in products
        if product["category"] == category
    ]

    # 2. Filter by budget
    filtered = [
        product for product in filtered
        if product["price"] <= budget
    ]

    # 3. Apply category-specific specification
    if spec:

        if category == "laptop":
            ram = int(float(spec))
            filtered = [
                product for product in filtered
                if product["ram"] >= ram
            ]

        elif category == "earbuds":
            battery = float(spec)
            filtered = [
                product for product in filtered
                if product["battery"] >= battery
            ]

        elif category == "tv":
            screen_size = int(float(spec))
            filtered = [
                product for product in filtered
                if product["screen_size"] >= screen_size
            ]

        elif category == "ac":
            tonnage = float(spec)
            filtered = [
                product for product in filtered
                if product["tonnage"] == tonnage
            ]

    # 4. Rank by rating
    filtered.sort(
        key=lambda product: product["rating"],
        reverse=True
    )

    # 5. Return top 3
    return {
        "recommendations": filtered[:3]
    }