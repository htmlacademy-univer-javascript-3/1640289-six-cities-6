import { render, screen } from '@testing-library/react';
import { OfferHost } from './offer-host.tsx';

test('renders OfferHost component correctly', () => {
  const hostData = {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  };
  const description = 'This is a description of the host.';

  render(<OfferHost hostData={hostData} description={description} />);

  const nameElement = screen.getByText(/John Doe/i);
  expect(nameElement).toBeInTheDocument();

  const avatarElement = screen.getByAltText('Host avatar');
  expect(avatarElement).toBeInTheDocument();
  expect(avatarElement).toHaveAttribute('src', hostData.avatarUrl);

  const proStatus = screen.getByText(/Pro/i);
  expect(proStatus).toBeInTheDocument();

  const descriptionElement = screen.getByText(description);
  expect(descriptionElement).toBeInTheDocument();
});

test('does not render "Pro" if isPro is false', () => {
  const hostData = {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: false,
  };
  const description = 'This is a description of the host.';

  render(<OfferHost hostData={hostData} description={description} />);

  const proStatus = screen.queryByText(/Pro/i);
  expect(proStatus).not.toBeInTheDocument();
});
