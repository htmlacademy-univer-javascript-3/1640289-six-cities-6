import React from 'react';

interface OfferGalleryProps {
  images: string[];
}

export const OfferGallery: React.FC<OfferGalleryProps> = ({ images }) => (
  <div className="offer__gallery-container container">
    <div className="offer__gallery">
      {images.map((imageUrl) => (
        <div key={imageUrl} className="offer__image-wrapper">
          <img className="offer__image" src={imageUrl} alt="Photo studio" />
        </div>
      ))}
    </div>
  </div>
);
