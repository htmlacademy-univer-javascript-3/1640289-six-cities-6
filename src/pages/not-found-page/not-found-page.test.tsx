import { render, screen } from '@testing-library/react';
import { NotFoundPage } from './not-found-page.tsx';
import { RoutePath } from '../../shared/constants/router';

test('renders NotFoundPage component', () => {
  render(<NotFoundPage />);

  const headingElement = screen.getByText(/404 Not Found/i);
  expect(headingElement).toBeInTheDocument();

  const linkElement = screen.getByRole('link', { name: /Go back to the main page/i });
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', RoutePath.Main);
});
