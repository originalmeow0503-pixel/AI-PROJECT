from __future__ import annotations

import sys
from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from ai_model.preprocess import (  # noqa: E402
    PRODUCT_RESPONSE_COLUMNS,
    RANKING_COLUMNS,
    encode_query_payload,
    normalize_request_payload,
)

DEFAULT_MODEL_PATH = PROJECT_ROOT / "ai_model" / "model.pkl"
DEFAULT_TOP_K = 10
MAX_TOP_K = 20


class RecommendationService:
    def __init__(self, model_path: Path | str = DEFAULT_MODEL_PATH) -> None:
        self.model_path = Path(model_path)
        self._load_model()

    def _load_model(self) -> None:
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"model.pkl not found at {self.model_path}. "
                "Run `python3 ai_model/train.py` first."
            )

        try:
            bundle = joblib.load(self.model_path)
        except Exception as exc:
            raise RuntimeError(
                "Could not load model.pkl. "
                "Run `python3 ai_model/train.py` again."
            ) from exc

        self.metadata = bundle.get("metadata", {})
        if self.metadata.get("bundle_format") != "simple-v2":
            raise RuntimeError(
                "This model file is old. "
                "Run `python3 ai_model/train.py` again."
            )

        rows = bundle.get("products")
        if not isinstance(rows, list) or not rows:
            raise RuntimeError("model.pkl is missing product rows.")

        feature_space = bundle.get("feature_space")
        if not isinstance(feature_space, dict) or not feature_space:
            raise RuntimeError("model.pkl is missing feature info.")

        vectors = bundle.get("feature_matrix")
        if vectors is None:
            raise RuntimeError("model.pkl is missing feature vectors.")

        self.products = pd.DataFrame(rows)
        self.feature_space = {
            str(key): [str(value) for value in values]
            for key, values in feature_space.items()
        }
        self.feature_matrix = np.asarray(vectors, dtype=np.float32)

        if self.feature_matrix.ndim != 2:
            raise RuntimeError("Model vectors are not in the right format.")

        if len(self.products) != len(self.feature_matrix):
            raise RuntimeError(
                "Model rows and vectors do not match. "
                "Run `python3 ai_model/train.py` again."
            )

        self.rank_ranges = {}
        for column in RANKING_COLUMNS:
            low = float(self.products[column].min())
            high = float(self.products[column].max())
            self.rank_ranges[column] = (low, high)

    def health(self) -> Dict[str, Any]:
        return {
            "status": "ok",
            "products_loaded": int(len(self.products)),
            "model_path": str(self.model_path.resolve()),
            "model_created_at": self.metadata.get("created_at"),
        }

    def recommend(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        top_k = self._parse_top_k(payload.get("top_k"))
        user_input = normalize_request_payload(payload)
        matches, mode = self._get_candidates(user_input)

        if matches.empty:
            return {
                "recommended_style": "",
                "summary": "No in-stock products found right now.",
                "score": 0.0,
                "products": [],
            }

        ranked = self._rank_items(matches, payload, user_input, top_k)
        products = [self._build_product(row) for _, row in ranked.iterrows()]
        best_style = products[0]["style"] if products else payload.get("style_preference", "")
        best_score = products[0]["score"] if products else 0.0

        return {
            "recommended_style": best_style,
            "summary": self._summary(payload, len(products), best_style, mode),
            "score": best_score,
            "products": products,
        }

    def _parse_top_k(self, value: Any) -> int:
        if value is None:
            return DEFAULT_TOP_K

        try:
            top_k = int(value)
        except (TypeError, ValueError) as exc:
            raise ValueError("`top_k` must be an integer.") from exc

        if top_k < 1 or top_k > MAX_TOP_K:
            raise ValueError(f"`top_k` must be between 1 and {MAX_TOP_K}.")

        return top_k

    def _get_candidates(self, user_input: Dict[str, str]) -> tuple[pd.DataFrame, str]:
        stock = self.products[self.products["stock_qty"] > 0].copy()
        steps = [
            ("exact", ["gender", "category", "occasion"]),
            ("occasion", ["gender", "occasion"]),
            ("category", ["gender", "category"]),
            ("gender", ["gender"]),
            ("fallback", []),
        ]
        tried = set()

        for mode, columns in steps:
            current = stock
            used = []

            for column in columns:
                value = user_input.get(column, "")
                if value:
                    current = current[current[f"{column}_normalized"] == value]
                    used.append(column)

            key = tuple(used)
            if key in tried:
                continue
            tried.add(key)

            if not current.empty:
                current = current.reset_index(drop=False).rename(
                    columns={"index": "model_index"}
                )
                return current, mode

        return stock.iloc[0:0].copy(), "no_results"

    def _rank_items(
        self,
        matches: pd.DataFrame,
        payload: Dict[str, Any],
        user_input: Dict[str, str],
        top_k: int,
    ) -> pd.DataFrame:
        query = encode_query_payload(payload, self.feature_space)
        ranked = matches.copy()
        ranked["knn_similarity"] = 0.0

        if np.any(query):
            row_ids = matches["model_index"].tolist()
            matrix = self.feature_matrix[row_ids]
            count = min(len(matches), max(top_k * 3, top_k))

            knn = NearestNeighbors(
                algorithm="brute",
                metric="cosine",
                n_neighbors=count,
            )
            knn.fit(matrix)

            distances, indices = knn.kneighbors(query)
            ranked = matches.iloc[indices[0]].copy()
            ranked["knn_similarity"] = 1 - distances[0]

        ranked["match_score"] = ranked.apply(
            lambda row: self._match_score(row, user_input), axis=1
        )
        ranked["product_score"] = ranked.apply(self._product_score, axis=1)

        ranked["final_score"] = (
            0.35 * ranked["knn_similarity"]
            + ranked["match_score"]
            + 0.20 * ranked["product_score"]
        )

        return ranked.sort_values(by="final_score", ascending=False).head(top_k)

    def _match_score(self, row: pd.Series, user_input: Dict[str, str]) -> float:
        score = 0.0

        gender = user_input.get("gender", "")
        if gender and row["gender_normalized"] == gender:
            score += 0.10

        category = user_input.get("category", "")
        if category and row["category_normalized"] == category:
            score += 0.075

        occasion = user_input.get("occasion", "")
        if occasion and row["occasion_normalized"] == occasion:
            score += 0.075

        style = user_input.get("style_preference", "")
        if style and row["style_normalized"] == style:
            score += 0.06

        color = user_input.get("preferred_color", "")
        if color and color in {
            row["primary_color_normalized"],
            row["secondary_color_normalized"],
        }:
            score += 0.05

        season = user_input.get("season", "")
        if season and row["season_normalized"] == season:
            score += 0.03

        age_group = user_input.get("age_group", "")
        if age_group and row["recommended_age_group_normalized"] == age_group:
            score += 0.03

        budget = user_input.get("budget_segment", "")
        if budget and row["budget_segment_normalized"] == budget:
            score += 0.03

        return score

    def _product_score(self, row: pd.Series) -> float:
        trend = self._scale("trend_score", row["trend_score"])
        popularity = self._scale("popularity_score", row["popularity_score"])
        rating = self._scale("rating", row["rating"])
        return 0.40 * trend + 0.30 * popularity + 0.30 * rating

    def _scale(self, column: str, value: float) -> float:
        low, high = self.rank_ranges[column]
        if high <= low:
            return 0.0
        return (float(value) - low) / (high - low)

    def _build_product(self, row: pd.Series) -> Dict[str, Any]:
        product = {column: row[column] for column in PRODUCT_RESPONSE_COLUMNS}
        product["image_url"] = f"/images/{product['product_id']}.jpg"

        product["score"] = round(float(row["final_score"]), 4)
        product["final_price_inr"] = round(float(product["final_price_inr"]), 2)
        product["rating"] = round(float(product["rating"]), 2)
        product["rating_count"] = int(product["rating_count"])
        product["stock_qty"] = int(product["stock_qty"])
        product["popularity_score"] = round(float(product["popularity_score"]), 2)
        product["trend_score"] = round(float(product["trend_score"]), 2)
        return product

    def _summary(
        self,
        payload: Dict[str, Any],
        product_count: int,
        recommended_style: str,
        mode: str,
    ) -> str:
        parts: List[str] = []
        for field in ("gender", "category", "occasion"):
            value = payload.get(field)
            if value:
                parts.append(str(value).strip())

        request_text = " / ".join(parts) if parts else "your filters"
        style = payload.get("style_preference")
        color = payload.get("preferred_color")
        season = payload.get("season")

        if mode == "exact":
            start = f"Found {product_count} matches for {request_text}."
        elif mode == "occasion":
            start = f"No exact category match, so these are the closest results for {request_text}."
        elif mode == "category":
            start = f"No exact occasion match, so these are the closest results for {request_text}."
        elif mode == "gender":
            start = "No exact match found, so I kept the same gender and picked the closest results."
        else:
            start = f"These are the closest in-stock results for {request_text}."

        bits: List[str] = []
        if style:
            bits.append(f"style {style}")
        if color:
            bits.append(f"color {color}")
        if season:
            bits.append(f"season {season}")

        if bits:
            return f"{start} Mostly {recommended_style}. Similar to {', '.join(bits)}."

        return f"{start} Mostly {recommended_style}."
