from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_PATH = PROJECT_ROOT / "data" / "fashion_recommendation_products_dataset.csv"

MODEL_FEATURES = [
    "gender",
    "recommended_age_group",
    "category",
    "occasion",
    "style",
    "primary_color",
    "season",
    "budget_segment",
]

REQUEST_TO_MODEL_FIELD = {
    "gender": "gender",
    "age_group": "recommended_age_group",
    "category": "category",
    "occasion": "occasion",
    "style_preference": "style",
    "preferred_color": "primary_color",
    "season": "season",
    "budget_segment": "budget_segment",
}

MODEL_TO_REQUEST_FIELD = {value: key for key, value in REQUEST_TO_MODEL_FIELD.items()}

FILTER_COLUMNS = ["gender", "category", "occasion"]
RANKING_COLUMNS = ["trend_score", "popularity_score", "rating"]

TEXT_COLUMNS = [
    "product_id",
    "product_name",
    "brand",
    "gender",
    "recommended_age_group",
    "category",
    "subcategory",
    "occasion",
    "style",
    "style_mood",
    "primary_color",
    "secondary_color",
    "season",
    "fabric",
    "fit",
    "sleeve_type",
    "neckline",
    "pattern",
    "embellishment",
    "recommended_body_type",
    "size_options",
    "budget_segment",
    "sustainable",
    "bestseller",
    "material_care",
    "search_tags",
    "image_url",
    "product_description",
]

NUMERIC_COLUMNS = [
    "mrp_inr",
    "discount_percent",
    "final_price_inr",
    "rating",
    "rating_count",
    "stock_qty",
    "return_rate",
    "popularity_score",
    "trend_score",
]

PRODUCT_RESPONSE_COLUMNS = [
    "product_id",
    "product_name",
    "brand",
    "gender",
    "category",
    "subcategory",
    "occasion",
    "style",
    "primary_color",
    "secondary_color",
    "season",
    "budget_segment",
    "final_price_inr",
    "rating",
    "rating_count",
    "stock_qty",
    "popularity_score",
    "trend_score",
    "image_url",
    "product_description",
]


def normalize_text(value: Any) -> str:
    if value is None:
        return ""

    text = str(value).strip().lower().replace("_", " ")
    return re.sub(r"\s+", " ", text)


def normalize_request_payload(payload: Dict[str, Any]) -> Dict[str, str]:
    return {
        key: normalize_text(value)
        for key, value in payload.items()
        if value is not None and str(value).strip()
    }


def load_products_dataframe(data_path: Path | str = DEFAULT_DATA_PATH) -> pd.DataFrame:
    products_df = pd.read_csv(Path(data_path))

    for column in TEXT_COLUMNS:
        if column in products_df.columns:
            products_df[column] = (
                products_df[column].fillna("Unknown").astype(str).str.strip()
            )

    for column in NUMERIC_COLUMNS:
        if column in products_df.columns:
            products_df[column] = pd.to_numeric(
                products_df[column], errors="coerce"
            ).fillna(0.0)

    products_df["product_id"] = products_df["product_id"].astype(str)

    normalized_columns = set(MODEL_FEATURES + ["secondary_color"])
    for column in normalized_columns:
        products_df[f"{column}_normalized"] = products_df[column].map(normalize_text)

    return products_df


def build_model_frame(products_df: pd.DataFrame) -> pd.DataFrame:
    model_frame = pd.DataFrame(index=products_df.index)
    for column in MODEL_FEATURES:
        model_frame[column] = products_df[f"{column}_normalized"]
    return model_frame


def build_feature_space(products_df: pd.DataFrame) -> Dict[str, List[str]]:
    feature_space: Dict[str, List[str]] = {}
    for column in MODEL_FEATURES:
        normalized_column = f"{column}_normalized"
        feature_space[column] = sorted(
            value
            for value in products_df[normalized_column].dropna().astype(str).unique().tolist()
            if value
        )
    return feature_space


def _encode_feature_values(
    feature_values: Dict[str, str], feature_space: Dict[str, List[str]]
) -> List[float]:
    encoded_row: List[float] = []

    for column in MODEL_FEATURES:
        selected_value = feature_values.get(column, "")
        for allowed_value in feature_space[column]:
            encoded_row.append(1.0 if selected_value and allowed_value == selected_value else 0.0)

    return encoded_row


def encode_products(products_df: pd.DataFrame, feature_space: Dict[str, List[str]]) -> np.ndarray:
    model_frame = build_model_frame(products_df)
    encoded_rows = []

    for _, row in model_frame.iterrows():
        encoded_rows.append(_encode_feature_values(row.to_dict(), feature_space))

    return np.asarray(encoded_rows, dtype=np.float32)


def encode_query_payload(
    payload: Dict[str, Any], feature_space: Dict[str, List[str]]
) -> np.ndarray:
    normalized_payload = normalize_request_payload(payload)
    query_values: Dict[str, str] = {}

    for model_field in MODEL_FEATURES:
        request_field = MODEL_TO_REQUEST_FIELD.get(model_field, model_field)
        query_values[model_field] = normalized_payload.get(request_field, "")

    return np.asarray(
        [_encode_feature_values(query_values, feature_space)],
        dtype=np.float32,
    )
