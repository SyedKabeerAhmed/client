import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onUpload, accept = 'image/*', multiple = false, label = 'Upload Files' }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    if (onUpload) {
      onUpload(droppedFiles);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (onUpload) {
      onUpload(selectedFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="file-upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        
        <p className="file-upload-text">
          {isDragging ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        
        <p className="file-upload-label">{label}</p>
      </div>

      {files.length > 0 && (
        <div className="file-preview">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <i className="fas fa-file-image"></i>
                <span>{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="file-thumbnail"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

