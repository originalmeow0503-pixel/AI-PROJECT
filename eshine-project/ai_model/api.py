from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from validation import run_all_validations
from model import get_model
import torch
import cv2
import numpy as np

app = FastAPI(title="AI Stylist Backend", version="1.0")

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model Skeleton
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
vton_model = get_model().to(device)
vton_model.eval()

@app.get("/")
def read_root():
    return {"status": "AI Stylist Backend is running!"}

@app.post("/validate")
async def validate_image(file: UploadFile = File(...)):
    """
    Receives an image and validates it for:
    - Blur
    - Lighting
    - Full body (Pose detection)
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    contents = await file.read()
    
    is_valid, errors = run_all_validations(contents)
    
    if not is_valid:
        return {"status": "error", "errors": errors}
        
    return {"status": "success", "message": "Image passed all validations."}

@app.post("/try-on")
async def try_on(
    person_image: UploadFile = File(...),
    garment_image1: UploadFile = File(...)
):
    """
    Runs the virtual try-on simulation.
    Takes a person image and a garment image.
    """
    person_contents = await person_image.read()
    
    # 1. Run Validation
    is_valid, errors = run_all_validations(person_contents)
    if not is_valid:
        # Instead of generic 400, send 400 with the exact error array for UI rendering
        return {"status": "error", "errors": errors}
        
    # 2. Preprocess Images (Mocking preprocessing)
    # Convert image bytes to tensors
    # H = 256, W = 192 for our dummy model
    person_tensor = torch.randn(1, 3, 256, 192).to(device)
    garment_tensor = torch.randn(1, 3, 256, 192).to(device)
    
    # 3. Model Inference (Mocked via hardcoded image for UI demonstration)
    import base64
    import os
    
    # Hardcoded demo output image generated to show "lady wearing clothes from landing page"
    demo_image_path = "/Users/ashay/.gemini/antigravity/brain/f58974e4-476b-49bc-b35c-87ff0922731f/magical_try_on_1774786245454.png"
    
    try:
        if os.path.exists(demo_image_path):
            with open(demo_image_path, "rb") as image_file:
                b64_img = base64.b64encode(image_file.read()).decode('utf-8')
        else:
            raise FileNotFoundError()
    except Exception as e:
        # Fallback to noise tensor if image moved or missing
        with torch.no_grad():
            output_tensor = vton_model(person_tensor, garment_tensor)
        output_np = output_tensor.squeeze().cpu().numpy().transpose(1, 2, 0)
        output_np = ((output_np + 1) / 2.0) * 255.0
        output_np = np.clip(output_np, 0, 255).astype(np.uint8)
        _, buffer = cv2.imencode('.png', cv2.cvtColor(output_np, cv2.COLOR_RGB2BGR))
        b64_img = base64.b64encode(buffer).decode('utf-8')

    return {
        "status": "success",
        "result_image_b64": f"data:image/png;base64,{b64_img}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
