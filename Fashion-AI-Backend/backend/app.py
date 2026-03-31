from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from recommend import RecommendationService

PROJECT_ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = PROJECT_ROOT / "data" / "images"

app = Flask(__name__)
recommender: RecommendationService | None = None


def fallback_image() -> str | None:
    for name in ("fallback.jpg", "fallback.jpeg", "fallback.png"):
        if (IMAGES_DIR / name).is_file():
            return name

    for pattern in ("*.jpg", "*.jpeg", "*.png"):
        matches = sorted(IMAGES_DIR.glob(pattern))
        if matches:
            return matches[0].name

    return None


def get_recommender() -> RecommendationService:
    global recommender
    if recommender is None:
        recommender = RecommendationService()
    return recommender


@app.get("/images/<path:filename>")
def image_file(filename: str):
    name = Path(filename).name
    image_path = IMAGES_DIR / name

    if image_path.is_file():
        return send_from_directory(IMAGES_DIR, name)

    fallback = fallback_image()
    if fallback:
        return send_from_directory(IMAGES_DIR, fallback)

    return jsonify({"error": "Image not found."}), 404


@app.get("/health")
def health():
    return jsonify({"status": "API running"}), 200


@app.post("/recommend")
def recommend():
    body = request.get_json(silent=True) or {}

    if not isinstance(body, dict):
        return jsonify({"error": "Send JSON in the request body."}), 400

    try:
        data = get_recommender().recommend(body)
        return jsonify(data), 200
    except ValueError as err:
        return jsonify({"error": str(err)}), 400
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 500
    except FileNotFoundError as err:
        return jsonify({"error": str(err)}), 500
    except Exception as err:
        return jsonify({"error": f"Something went wrong: {err}"}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5000")),
        debug=False,
    )
