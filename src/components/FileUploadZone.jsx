import React, { useState } from 'react';

export default function FileUploadZone({ onFileSelect, accept = '.csv,.xlsx,.xls', label = 'Upload File' }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <label
      className={`upload-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" accept={accept} onChange={(e) => onFileSelect(e.target.files[0])} hidden />
      <svg className="cloud-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 13a7 7 0 0 0-12 5.2A7 7 0 0 0 19 13z" />
        <path d="M12 2v9m0 0l-3-3m3 3l3-3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 18h14a2 2 0 0 1 2 2v1H3v-1a2 2 0 0 1 2-2z" />
      </svg>
      <span className="upload-text">Drag & drop or click to upload</span>
      <span className="upload-hint" style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
        Supported formats: CSV, XLSX, XLS
      </span>
      <style>{`
        .upload-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 24px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          background-color: #f9fafb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-zone:hover {
          border-color: #2563eb;
          background-color: #f0f9ff;
        }

        .upload-zone.dragging {
          border-color: #2563eb;
          background-color: #eff6ff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1),
                      inset 0 0 0 1px rgba(37, 99, 235, 0.2);
          transform: scale(1.01);
        }

        .cloud-icon {
          width: 56px;
          height: 56px;
          color: #aab8c2;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .upload-zone:hover .cloud-icon {
          color: #2563eb;
        }

        .upload-zone.dragging .cloud-icon {
          color: #2563eb;
          transform: scale(1.1);
        }

        .upload-text {
          font-size: 15px;
          font-weight: 500;
          color: #1f2937;
          text-align: center;
          transition: color 0.2s ease;
        }

        .upload-zone:hover .upload-text {
          color: #2563eb;
        }

        .upload-zone.dragging .upload-text {
          color: #2563eb;
          font-weight: 600;
        }

        .upload-hint {
          color: #9ca3af;
        }

        .upload-zone.dragging .upload-hint {
          color: #2563eb;
        }
      `}</style>
    </label>
  );
}
