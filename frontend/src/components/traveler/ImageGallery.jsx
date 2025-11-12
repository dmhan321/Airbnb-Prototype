import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getImageUrl } from '../../utils/imageUtils';
import './ImageGallery.css';

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Process images through getImageUrl to handle microservices
  // Use useMemo to avoid recalculating on every render
  const processedImages = useMemo(() => {
    return images && images.length > 0 ? images.map(img => getImageUrl(img)) : [];
  }, [images]);

  const handleKeyPress = useCallback((e) => {
    if (showLightbox) {
      if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? (processedImages.length > 0 ? processedImages.length - 1 : 0) : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === (processedImages.length > 0 ? processedImages.length - 1 : 0) ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setShowLightbox(false);
      }
    }
  }, [showLightbox, processedImages.length]);

  // All hooks must be called before any early returns
  useEffect(() => {
    if (showLightbox) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [showLightbox, handleKeyPress]);

  // Early return after all hooks
  if (!processedImages || processedImages.length === 0) {
    return (
      <div className="image-gallery">
        <div className="image-gallery-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </div>
    );
  }

  const mainImage = processedImages[currentIndex];
  const hasMultipleImages = processedImages.length > 1;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? processedImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === processedImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleMainImageClick = () => {
    if (hasMultipleImages) {
      setShowLightbox(true);
    }
  };

  const handleLightboxClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowLightbox(false);
    }
  };

  return (
    <>
      <div className="image-gallery">
        {/* Main Image */}
        <div className="image-gallery-main" onClick={handleMainImageClick}>
          <img src={mainImage} alt={`Property image ${currentIndex + 1}`} />
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                className="image-gallery-nav image-gallery-nav-prev"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button
                className="image-gallery-nav image-gallery-nav-next"
                onClick={handleNext}
                aria-label="Next image"
              >
                <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="image-gallery-counter">
              {currentIndex + 1} / {processedImages.length}
            </div>
          )}

          {/* Show All Photos Button */}
          {hasMultipleImages && (
            <button
              className="image-gallery-show-all"
              onClick={() => setShowLightbox(true)}
            >
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 17l3.5-4.5 2.5 3.01L14.5 11l4.5 6H5z"/>
              </svg>
              Show all photos
            </button>
          )}
        </div>

        {/* Thumbnail Strip */}
        {hasMultipleImages && processedImages.length > 1 && (
          <div className="image-gallery-thumbnails">
            {processedImages.slice(0, 5).map((image, index) => (
              <div
                key={index}
                className={`image-gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
            {processedImages.length > 5 && (
              <div
                className="image-gallery-thumbnail image-gallery-thumbnail-more"
                onClick={() => setShowLightbox(true)}
              >
                <span>+{processedImages.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="image-gallery-lightbox" onClick={handleLightboxClose}>
          <button
            className="image-gallery-lightbox-close"
            onClick={() => setShowLightbox(false)}
            aria-label="Close lightbox"
          >
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          <div className="image-gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={processedImages[currentIndex]} alt={`Property image ${currentIndex + 1}`} />
            
            <button
              className="image-gallery-lightbox-nav image-gallery-lightbox-prev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <button
              className="image-gallery-lightbox-nav image-gallery-lightbox-next"
              onClick={handleNext}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>

            <div className="image-gallery-lightbox-counter">
              {currentIndex + 1} / {processedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

