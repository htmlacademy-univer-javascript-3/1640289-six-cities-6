import { render } from '@testing-library/react';
import Spinner from './spinner.tsx';

test('renders spinner component', () => {
  const { container } = render(<Spinner />);

  const spinnerElement = container.querySelector('.spinner');
  const loaderElement = container.querySelector('.loader');

  expect(spinnerElement).toBeInTheDocument();
  expect(loaderElement).toBeInTheDocument();
});
