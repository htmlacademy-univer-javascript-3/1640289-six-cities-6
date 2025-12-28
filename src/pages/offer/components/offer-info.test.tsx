import { render, screen } from '@testing-library/react';
import { OfferInfo } from './offer-info';
import { AdditionalOfferInfo } from '../../../shared/types/offer';
import { vi } from 'vitest';

vi.mock('../../../shared/utils/offer', () => ({
  getRatingPercent: vi.fn(() => '75%'),
}));

test('renders OfferInfo component correctly', () => {
  const offerData: AdditionalOfferInfo = {
    id: '12432545',
    city: { name: 'City', location: { latitude: 52.52, longitude: 13.4050, zoom: 10 } },
    location: { latitude: 52.52, longitude: 13.4050, zoom: 10 },
    isFavorite: false,
    type: 'Apartment',
    price: 100,
    rating: 4.5,
    title: 'Beautiful Apartment in the city center',
    isPremium: true,
    bedrooms: 2,
    maxAdults: 4,
    goods: ['WiFi', 'Air conditioning', 'Parking'],
    description: 'A beautiful and spacious apartment in the city center.',
    host: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: true,
    },
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  };

  render(<OfferInfo offerData={offerData} />);

  const titleElement = screen.getByText(offerData.title);
  expect(titleElement).toBeInTheDocument();

  const ratingElement = screen.getByText(offerData.rating.toString());
  expect(ratingElement).toBeInTheDocument();

  const starsElement = screen.getByText('Rating').parentElement?.querySelector('span');
  expect(starsElement).toHaveStyle('width: 75%');
});

test('does not render Premium marker if isPremium is false', () => {
  const offerData: AdditionalOfferInfo = {
    id: '12432545',
    city: { name: 'City', location: { latitude: 52.52, longitude: 13.4050, zoom: 10 } },
    location: { latitude: 52.52, longitude: 13.4050, zoom: 10 },
    isFavorite: false,
    type: 'Apartment',
    price: 100,
    rating: 4.5,
    title: 'Beautiful Apartment in the city center',
    isPremium: true,
    bedrooms: 2,
    maxAdults: 4,
    goods: ['WiFi', 'Air conditioning', 'Parking'],
    description: 'A beautiful and spacious apartment in the city center.',
    host: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: true,
    },
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  };

  render(<OfferInfo offerData={offerData} />);

  const premiumMarker = screen.queryByRole('status');
  expect(premiumMarker).toBeNull();
});
