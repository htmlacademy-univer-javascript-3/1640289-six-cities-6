import { render, screen } from '@testing-library/react';
import { OfferGallery } from './offer-gallery.tsx';

test('renders OfferGallery component with images', () => {
  const images = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  render(<OfferGallery images={images} />);

  const imageElements = screen.getAllByAltText('Photo studio');

  expect(imageElements).toHaveLength(images.length);

  imageElements.forEach((imageElement, index) => {
    expect(imageElement).toHaveAttribute('src', images[index]);
  });
});
