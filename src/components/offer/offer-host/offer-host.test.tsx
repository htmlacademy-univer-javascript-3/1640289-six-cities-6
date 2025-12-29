import { render, screen } from '@testing-library/react';
import { OfferHost } from './offer-host.tsx';

const HOST_DATA = {
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  isPro: true,
};
const DESCRIPTION = 'This is a description of the host.';

test('renders OfferHost component correctly', () => {
  render(<OfferHost hostData={HOST_DATA} description={DESCRIPTION} />);

  const nameElement = screen.getByText(/John Doe/i);
  expect(nameElement).toBeInTheDocument();

  const avatarElement = screen.getByAltText('Host avatar');
  expect(avatarElement).toBeInTheDocument();
  expect(avatarElement).toHaveAttribute('src', HOST_DATA.avatarUrl);

  const proStatus = screen.getByText(/Pro/i);
  expect(proStatus).toBeInTheDocument();

  const descriptionElement = screen.getByText(DESCRIPTION);
  expect(descriptionElement).toBeInTheDocument();
});

test('does not render "Pro" if isPro is false', () => {

  render(<OfferHost hostData={HOST_DATA} description={DESCRIPTION} />);

  const proStatus = screen.queryByText(/isPro/i);
  expect(proStatus).not.toBeInTheDocument();
});
