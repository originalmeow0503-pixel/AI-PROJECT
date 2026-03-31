import React, { useState, useRef } from 'react';
import { useTryOn } from '../context/TryOnContext';
import { Upload, X, Wand2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

const AIStylistPage = () => {
  const { selectedGarments, removeGarment, clearGarments } = useTryOn();
  
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  
  const [status, setStatus] = useState('idle'); // idle | validating | error | generating | success
  const [validationErrors, setValidationErrors] = useState([]);
  const [resultImage, setResultImage] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setStatus('idle');
        setValidationErrors([]);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoFile(null);
    setStatus('idle');
    setValidationErrors([]);
    setResultImage(null);
  };

  const handleTryOn = async () => {
    if (!photoFile) return;
    if (selectedGarments.length === 0) {
      setValidationErrors(["Please select at least one garment to try on."]);
      setStatus('error');
      return;
    }

    setStatus('validating');
    setValidationErrors([]);

    // Create form data
    const formData = new FormData();
    formData.append('person_image', photoFile);
    
    // In a real app, you would download the garment blob or have actual garment URLs
    // Since images are placeholders '#', we will just send empty parts or mock it in our backend
    // Our Mock Backend expects 'person_image', 'garment_image1', 'garment_image2'
    
    // To make it easy for now, we will create a dummy blob for garments just to pass FastAPI validation
    const emptyBlob = new Blob(['dummy'], { type: 'image/jpeg' });
    formData.append('garment_image1', emptyBlob, 'garment1.jpg');
    if (selectedGarments.length > 1) {
      formData.append('garment_image2', emptyBlob, 'garment2.jpg');
    }

    try {
      const response = await fetch('http://localhost:8000/try-on', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        setStatus('error');
        setValidationErrors(data.errors || (data.detail && data.detail.errors) || ["Failed to process image. It might not be a valid image format."]);
        return;
      }

      // Success
      setStatus('success');
      setResultImage(data.result_image_b64);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      setValidationErrors(["Could not connect to AI backend. Make sure the FastAPI server is running."]);
    }
  };

  return (
    <div className="stylist-page container">
      <div className="stylist-header text-center">
        <h1>AI Stylist Virtual Try-On</h1>
        <p>See it before you buy it. Upload a full-body photo to virtually try on selected garments.</p>
      </div>

      <div className="stylist-grid">
        {/* Left Col: Selections */}
        <div className="stylist-sidebar">
          <h3>Your Try-On Box</h3>
          <p className="sub-text" style={{marginBottom: '20px'}}>
            {selectedGarments.length} / 2 items selected
          </p>

          <div className="selected-garments-list">
            {selectedGarments.length === 0 ? (
              <div className="empty-state">
                <p>Your box is empty. Browse products and click "Try it out" to add them here.</p>
              </div>
            ) : (
              selectedGarments.map((garment, idx) => (
                <div key={idx} className="garment-card">
                  <div className="garment-img">
                    {garment.image === '#' ? <div className="placeholder-img" style={{fontSize:'8px'}}>IMG</div> : <img src={garment.image} alt={garment.name} />}
                  </div>
                  <div className="garment-info">
                    <h4>{garment.name}</h4>
                    <p>{garment.price}</p>
                  </div>
                  <button className="remove-btn" onClick={() => removeGarment(garment.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {selectedGarments.length > 0 && (
             <button className="btn-outline clear-all-btn" onClick={clearGarments} style={{marginTop: '20px', width: '100%'}}>
               Clear Box
             </button>
          )}
        </div>

        {/* Right Col: Try-On Studio */}
        <div className="stylist-main">
          {status === 'success' && resultImage ? (
             <div className="result-view">
               <div className="result-image-container">
                 <img src={resultImage} alt="Virtual Try-On Result" />
               </div>
               <div className="result-actions">
                  <button className="btn-black btn-block" style={{marginTop: '20px'}} onClick={() => {
                    setStatus('idle');
                    setResultImage(null);
                  }}>
                    Try Another Photo
                  </button>
               </div>
             </div>
          ) : (
            <div className={`upload-zone ${photo ? 'has-photo' : ''}`}>
               {!photo ? (
                 <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                   <div className="upload-icon-wrapper">
                     <Upload size={32} />
                   </div>
                   <h3>Upload Your Photo</h3>
                   <p>Must be a full-body, well-lit image without blur.</p>
                   <button className="btn-black" style={{marginTop: '20px', width: 'auto', padding: '10px 30px'}}>Select Image</button>
                 </div>
               ) : (
                 <div className="photo-preview-container">
                    <img src={photo} alt="Upload Preview" className="photo-preview" />
                    <button className="remove-photo-btn" onClick={clearPhoto}>
                      <X size={20} color="#fff" />
                    </button>
                 </div>
               )}
               <input 
                 type="file" 
                 accept="image/*" 
                 ref={fileInputRef} 
                 onChange={handlePhotoUpload} 
                 style={{ display: 'none' }}
               />
            </div>
          )}

          {/* Status & Errors */}
          {(status === 'validating' || status === 'generating') && (
            <div className="status-indicator">
              <RefreshCw className="spinner" size={24} />
              <p>{status === 'validating' ? 'Validating image quality & posture...' : 'Generating try-on image...'}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="error-box">
              <div className="error-header" style={{display:'flex', alignItems:'center', gap:'10px', color: '#B30000', fontWeight: 'bold', marginBottom: '10px'}}>
                <AlertCircle size={20} />
                <span>Image Validation Failed</span>
              </div>
              <ul className="error-list" style={{color: '#B30000', paddingLeft: '20px', marginBottom: '15px'}}>
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <button className="btn-outline" onClick={() => fileInputRef.current?.click()}>
                Upload New Image
              </button>
            </div>
          )}

          {!resultImage && (
            <button 
              className="btn-black btn-block generate-btn" 
              onClick={handleTryOn}
              disabled={!photo || selectedGarments.length === 0 || status === 'validating' || status === 'generating'}
              style={{marginTop: '20px', opacity: (!photo || selectedGarments.length === 0) ? 0.5 : 1}}
            >
              <Wand2 size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} /> Generate Try-On
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default AIStylistPage;
