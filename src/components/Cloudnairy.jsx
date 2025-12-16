import React, { useRef, useState, useCallback, useEffect } from "react";

const CloudinaryUploader = ({ onUpload, resetKey }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Reset component when resetKey changes (e.g., when form is submitted)
  useEffect(() => {
    if (resetKey) {
      setPreview(null);
      setProgress(0);
      setUploadStatus(null);
      setIsUploading(false);
      setIsDragOver(false);
    }
  }, [resetKey]);

  // Reset component when no logo is provided
  useEffect(() => {
    if (!onUpload || onUpload === '') {
      setPreview(null);
      setProgress(0);
      setUploadStatus(null);
    }
  }, [onUpload]);


  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
    }

    if (file.size > maxSize) {

      throw new Error('File size must be less than 10MB');
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragOver(true);
    }
  }, [isUploading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);


  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      uploadToCloudinary(file);
    }
  }, [isUploading]);


  const uploadToCloudinary = async (file) => {
    try {
      validateFile(file);
      setUploadStatus(null);
      setIsUploading(true);
      setProgress(1);

      const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
      const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);


      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Initialize the request with POST method and URL
      xhr.open('POST', url);

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      // Handle upload completion
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setPreview(response.secure_url);
            setProgress(100);
            setUploadStatus({ type: 'success', message: 'Logo uploaded successfully!' });

            onUpload(response.secure_url);
          } else {
            const errorMsg = `Upload failed (${xhr.status}): ${xhr.responseText}`;
            setUploadStatus({ type: 'error', message: 'Upload failed. Please try again.' });
            console.error(errorMsg);
            setProgress(0);
          }
          setIsUploading(false);
        }
      };

      // Handle upload errors
      xhr.onerror = () => {
        setUploadStatus({ type: 'error', message: 'Network error occurred. Please check your connection.' });
        setProgress(0);
        setIsUploading(false);
      };

      xhr.send(formData);

    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
      setProgress(0);
      setIsUploading(false);
    }
  };

  const uploadFromInput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadToCloudinary(file);
  };

  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setPreview(null);
    setUploadStatus(null);
    setProgress(0);
    onUpload('');
  };

  return (
    <div className="cloudinary-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadFromInput}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        style={{ display: "none" }}
      />
      
      {!isUploading && progress !== 100 && (
        <div
          className={`upload-drop-zone ${isDragOver ? 'upload-drop-zone--drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <button
            type="button"
            className={`file-upload-btn ${isUploading ? 'file-upload-btn--loading' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleUploadClick();
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                📁 Upload Logo
              </>
            )}
          </button>
          {isDragOver && (
            <div className="upload-drop-zone__overlay">
              <span className="upload-drop-zone__text">Drop your image here</span>
            </div>
          )}
        </div>
      )}

      {uploadStatus && (
        <div className={`upload-status upload-status--${uploadStatus.type}`}>
          {uploadStatus.message}
        </div>
      )}

      {progress > 0 && progress < 100 && (
        <div className="upload-progress">
          <div className="upload-progress__info">
            <span className="upload-progress__text">
              {progress < 100 ? `Uploading: ${progress}%` : 'Upload Complete!'}
            </span>
            {progress === 100 && <span className="upload-progress__success">✅</span>}
          </div>
          <div className="upload-progress__bar">
            <div 
              className="upload-progress__fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {progress === 100 && preview && (
        <div className="uploaded-preview">
          <div className="uploaded-preview__info">
            <span className="uploaded-preview__title">Uploaded Logo:</span>
            <button
              type="button"
              className="uploaded-preview__remove"
              onClick={removeImage}
              title="Remove logo"
            >
              ❌
            </button>
          </div>
          <img 
            src={preview} 
            alt="Uploaded Logo" 
            className="uploaded-preview__image"
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;