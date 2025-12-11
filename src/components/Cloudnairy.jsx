import React, { useRef, useState } from "react";

const CloudinaryUploader = ({ onUpload }) =>{
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadToCloudinary = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    setProgress(1);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          setPreview(response.secure_url);
          setProgress(100);

          onUpload(response.secure_url);
        } else {
          console.error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`);
          setProgress(0);
          alert('Upload failed. Please check the console for details.');
        }
      }
    };

    xhr.send(formData);
  };

  return (
    <div className="cloudinary-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadToCloudinary}
        style={{ display: "none" }}
      />
      {progress !== 100 && (
        <button
          type="button"
          className="file-upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          + Upload Logo
        </button>
      )}
      {progress > 0 && (
        <div style={{ marginTop: "10px" }}>
          <p>{progress === 100 ? "Upload Complete: 100%" : `Uploading: ${progress}%`}</p>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#ccc",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4caf50",
                transition: "width 0.2s ease",
              }}
            ></div>
          </div>
        </div>
      )}

      {progress === 100 && preview && (
        <div style={{ marginTop: "10px" }}>
          <img src={preview} alt="Uploaded Logo" style={{ maxWidth: "100px", maxHeight: "100px" }} />
        </div>
      )}
    </div>
  );
}

export default CloudinaryUploader;