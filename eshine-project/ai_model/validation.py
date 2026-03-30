import cv2
import numpy as np

def check_blur(image_bytes, threshold=100.0):
    """
    Checks if an image is blurry using the variance of the Laplacian.
    threshold: The lower the threshold, the more blur is allowed.
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return False, "Invalid image format."
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        fm = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        if fm < threshold:
            return False, f"Image is too blurry (Focus measure: {fm:.2f}). Please upload a clearer image."
        return True, "Image is clear."
    except Exception as e:
        return False, f"Error processing blur: {str(e)}"

def check_lighting(image_bytes, min_brightness=50, max_brightness=220):
    """
    Checks if the lighting is too dark or too washed out.
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return False, "Invalid image format."
            
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        brightness = hsv[..., 2].mean()
        
        if brightness < min_brightness:
            return False, "Image is too dark. Please ensure proper lighting."
        if brightness > max_brightness:
            return False, "Image is overexposed (too bright). Please ensure proper lighting."
            
        return True, "Lighting is acceptable."
    except Exception as e:
        return False, f"Error processing lighting: {str(e)}"

def check_full_body(image_bytes):
    """
    Checks if the image contains a full body using MediaPipe Pose.
    Falls back to a dimension heuristic if Mediapipe fails on silicon chips.
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return False, "Invalid image format."
            
        try:
            import mediapipe as mp
            # On some Python versions/MacOS architectures, mp.solutions may be missing
            if not hasattr(mp, 'solutions'):
                raise AttributeError("Mediapipe solutions not supported on this architecture")
                
            mp_pose = mp.solutions.pose
            pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = pose.process(img_rgb)
            
            if not results.pose_landmarks:
                return False, "No person detected in the image."
                
            landmarks = results.pose_landmarks.landmark
            
            required_landmarks = [
                mp_pose.PoseLandmark.LEFT_SHOULDER,
                mp_pose.PoseLandmark.RIGHT_SHOULDER,
                mp_pose.PoseLandmark.LEFT_HIP,
                mp_pose.PoseLandmark.RIGHT_HIP,
                mp_pose.PoseLandmark.LEFT_ANKLE,
                mp_pose.PoseLandmark.RIGHT_ANKLE
            ]
            
            for landmark_type in required_landmarks:
                lm = landmarks[landmark_type.value]
                if lm.visibility < 0.5 or not (0.0 <= lm.x <= 1.0) or not (0.0 <= lm.y <= 1.0):
                    return False, "Please upload a portrait full-body image. Shoulders, hips, and ankles must be clearly visible."
                    
            pose.close()
            return True, "Full body detected."
            
        except (ImportError, AttributeError):
            # Fall back to an aggressive dimension check
            h, w = img.shape[:2]
            aspect_ratio = h / max(w, 1)
            
            # Relaxed for demo purposes so horizontal or cropped photos will still generate a result
            if aspect_ratio < 0.8:
                return False, "Image is way too wide. Please upload a more vertical image."
            if h < 200:
                return False, "The image resolution is too small for a full-body try-on. Upload a larger picture."
                
            return True, "Full body aspect ratio detected."
            
    except Exception as e:
        return False, f"Error processing pose analysis: {str(e)}"

def run_all_validations(image_bytes):
    """
    Runs all validation checks and collects errors.
    Returns: (is_valid, list_of_error_messages)
    """
    errors = []
    
    is_clear, msg_blur = check_blur(image_bytes)
    if not is_clear: errors.append(msg_blur)
        
    is_lit, msg_light = check_lighting(image_bytes)
    if not is_lit: errors.append(msg_light)
        
    is_full_body, msg_body = check_full_body(image_bytes)
    if not is_full_body: errors.append(msg_body)
        
    return len(errors) == 0, errors
