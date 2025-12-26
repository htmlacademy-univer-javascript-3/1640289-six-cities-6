import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface OfferGalleryProps {
  images: string[];
}

export const OfferGallery: React.FC<OfferGalleryProps> = ({ images }) => (
  <div className="offer__gallery-container container">
    <div className="offer__gallery">
      {images.map((imageUrl) => (
        <div key={uuidv4()} className="offer__image-wrapper">
          <img className="offer__image" src={imageUrl} alt="Photo studio" />
        </div>
      ))}
    </div>
  </div>
);
