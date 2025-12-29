import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FavoriteEmpty } from './favorite-empty.tsx';

vi.mock('../../components/header/header.tsx', () => ({
  Header: () => <div>Mocked Header</div>,
}));

describe('FavoriteEmpty', () => {
  it('should render the FavoriteEmpty component with all elements', () => {
    render(<FavoriteEmpty />);

    expect(screen.getByText('Mocked Header')).toBeInTheDocument();

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();

    expect(screen.getByText('Save properties to narrow down search or plan your future trips.')).toBeInTheDocument();

    const footerLogoLink = screen.getByRole('link');
    expect(footerLogoLink).toBeInTheDocument();
    expect(footerLogoLink).toHaveAttribute('href', 'main.html');

    const footerLogo = screen.getByAltText('6 cities logo');
    expect(footerLogo).toBeInTheDocument();
    expect(footerLogo).toHaveAttribute('width', '64');
    expect(footerLogo).toHaveAttribute('height', '33');
  });
});
