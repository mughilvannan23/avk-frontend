import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTrash, FaSpinner } from 'react-icons/fa';
import { uploadService } from '../../services/api';

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const data = await uploadService.uploadImages(files);
      const newUrls = data.urls || (data.url ? [data.url] : []);
      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError(err.response?.data?.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleAddUrl = () => {
    if (imageUrlInput.trim()) {
      onChange([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  return (
    <div className="image-uploader-container mb-3">
      <label className="form-label font-monospace text-uppercase fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>
        Product Images (Upload or paste Image URL)
      </label>

      {/* Direct URL Input Row */}
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Paste Image URL (e.g. https://... or /uploads/...)"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleAddUrl}
        >
          + Add Image URL
        </button>
      </div>

      {/* Dropzone Upload Button */}
      <div className="border border-2 border-dashed rounded-3 p-3 text-center bg-light position-relative mb-3">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
          style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
        />
        {uploading ? (
          <div className="py-2 text-danger">
            <FaSpinner className="spinner-border spinner-border-sm me-2" />
            <span>Uploading images...</span>
          </div>
        ) : (
          <div className="py-1 text-muted">
            <FaCloudUploadAlt size={28} className="text-danger mb-1" />
            <p className="mb-0 small fw-bold text-dark">Click or Drag & Drop image files here</p>
            <span className="extra-small text-muted" style={{ fontSize: '0.75rem' }}>Supports JPG, PNG, WEBP</span>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="row g-2">
          {images.map((url, idx) => (
            <div key={idx} className="col-4 col-sm-3 col-md-2 position-relative">
              <div className="ratio ratio-1x1 rounded overflow-hidden border shadow-sm">
                <img src={url} alt={`Upload ${idx + 1}`} style={{ objectFit: 'cover' }} />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex align-items-center justify-content-center"
                style={{ width: '24px', height: '24px', fontSize: '10px' }}
                title="Remove image"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
