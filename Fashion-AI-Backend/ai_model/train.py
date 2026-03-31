from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
from sklearn.neighbors import NearestNeighbors

from preprocess import (
    DEFAULT_DATA_PATH,
    build_feature_space,
    encode_products,
    MODEL_FEATURES,
    RANKING_COLUMNS,
    load_products_dataframe,
)

DEFAULT_MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"
DEFAULT_NEIGHBOR_COUNT = 50


def train_and_save_model(
    data_path: Path | str = DEFAULT_DATA_PATH,
    model_path: Path | str = DEFAULT_MODEL_PATH,
) -> dict:
    products_df = load_products_dataframe(data_path)
    eligible_products = products_df[products_df["stock_qty"] > 0].copy().reset_index(
        drop=True
    )

    if eligible_products.empty:
        raise ValueError("No in-stock products were found in the dataset.")

    feature_space = build_feature_space(eligible_products)
    feature_matrix = encode_products(eligible_products, feature_space)
    neighbor_count = min(DEFAULT_NEIGHBOR_COUNT, len(eligible_products))

    knn_model = NearestNeighbors(
        algorithm="brute",
        metric="cosine",
        n_neighbors=neighbor_count,
    )
    knn_model.fit(feature_matrix)

    bundle = {
        "products": eligible_products.to_dict(orient="records"),
        "feature_space": feature_space,
        "feature_matrix": feature_matrix.tolist(),
        "metadata": {
            "bundle_format": "simple-v2",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "data_path": str(Path(data_path).resolve()),
            "model_features": MODEL_FEATURES,
            "ranking_columns": RANKING_COLUMNS,
            "product_count": int(len(eligible_products)),
            "neighbor_count": int(neighbor_count),
            "feature_count": int(feature_matrix.shape[1]),
        },
    }

    model_path = Path(model_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, model_path)
    return bundle["metadata"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the fashion KNN model.")
    parser.add_argument(
        "--data-path",
        type=Path,
        default=DEFAULT_DATA_PATH,
        help="Path to the product dataset CSV.",
    )
    parser.add_argument(
        "--model-path",
        type=Path,
        default=DEFAULT_MODEL_PATH,
        help="Path where the trained model bundle should be saved.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    metadata = train_and_save_model(args.data_path, args.model_path)
    print(json.dumps(metadata, indent=2))
    print(f"Saved model bundle to: {args.model_path.resolve()}")


if __name__ == "__main__":
    main()
