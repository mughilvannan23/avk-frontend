import React, { useState, useEffect } from 'react';

export default function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset selected image index if the product changes (images list updates)
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery-main-wrapper text-center py-5 text-muted">
        No Images Available
      </div>
    );
  }

  return (
    <div>
      {/* Main Image Viewport */}
      <div className="product-gallery-main-wrapper shadow-sm">
        <img
          src={images[activeIndex]}
          alt="Product View"
          className="product-gallery-main"
        />
      </div>

      {/* Selectable Thumbnails Grid */}
      <div className="product-gallery-thumb-row">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`product-gallery-thumb-wrapper ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
            title={`View image ${idx + 1}`}
          >
            <img
              src={img}
              alt={`Thumbnail View ${idx + 1}`}
              className="product-gallery-thumb"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
