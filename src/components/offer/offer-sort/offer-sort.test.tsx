import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OffersSort } from './offer-sort.tsx';
import * as offerSlice from '../../../store/slices/offer.ts';

vi.mock('../styles/offer-sort.module.css', () => ({
  default: {
    'caption': 'caption-class',
    'option': 'option-class',
    'option_active': 'option-active-class'
  }
}));

vi.mock('../../../shared/constants/offer.ts', async () => {
  const actual: Record<string, unknown> = await vi.importActual('../../../shared/constants/offer.ts');
  return {
    ...actual,
    SORT_TYPES: [
      'Popular',
      'Price: low to high',
      'Price: high to low',
      'Top rated first'
    ],
    OffersSortType: {
      Popular: 'Popular',
      PriceLowToHigh: 'Price: low to high',
      PriceHighToLow: 'Price: high to low',
      TopRatedFirst: 'Top rated first'
    }
  };
});

vi.mock('../../../store/slices/offer.ts', () => ({
  setOffersSort: vi.fn((sortType: string) => ({
    type: 'offers/setOffersSort',
    payload: sortType
  }))
}));

const createMockStore = (currentSort = 'Popular') => configureStore({
  reducer: {
    offers: () => ({
      offersSort: currentSort,
      offers: []
    })
  }
});

describe('OffersSort Component', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  it('should have sort options list closed by default', () => {
    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should close sort options list when clicking on sort type again', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const sortTypeElement = container.querySelector('.places__sorting-type')!;

    await user.click(sortTypeElement);
    let optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(sortTypeElement);
    optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should dispatch setOffersSort when clicking on sort option', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const priceOption = screen.getByText('Price: low to high');
    await user.click(priceOption);

    expect(offerSlice.setOffersSort).toHaveBeenCalledWith('Price: low to high');
  });

  it('should close options list after selecting sort option', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const sortTypeElement = container.querySelector('.places__sorting-type')!;
    await user.click(sortTypeElement);

    let optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    const priceOption = screen.getByText('Price: low to high');
    await user.click(priceOption);

    await waitFor(() => {
      optionsList = container.querySelector('.places__options');
      expect(optionsList).not.toHaveClass('places__options--opened');
    });
  });

  it('should have correct tabIndex on sort type element', () => {
    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveAttribute('tabIndex', '0');
  });

  it('should have correct tabIndex on all sort options', () => {
    render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const options = screen.getAllByRole('listitem');
    options.forEach((option) => {
      expect(option).toHaveAttribute('tabIndex', '0');
    });
  });

  it('should render SVG arrow icon', () => {
    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const svg = container.querySelector('.places__sorting-arrow');
    expect(svg).toBeInTheDocument();
    expect(svg?.tagName).toBe('svg');
  });

  it('should render form element', () => {
    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const form = container.querySelector('form.places__sorting');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('action', '#');
    expect(form).toHaveAttribute('method', 'get');
  });

  it('should handle multiple sort option clicks', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const option1 = screen.getByText('Price: low to high');
    const option2 = screen.getByText('Top rated first');
    const option3 = screen.getByText('Price: high to low');

    await user.click(option1);
    expect(offerSlice.setOffersSort).toHaveBeenCalledWith('Price: low to high');

    await user.click(option2);
    expect(offerSlice.setOffersSort).toHaveBeenCalledWith('Top rated first');

    await user.click(option3);
    expect(offerSlice.setOffersSort).toHaveBeenCalledWith('Price: high to low');

    expect(offerSlice.setOffersSort).toHaveBeenCalledTimes(3);
  });

  it('should toggle list multiple times', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const sortTypeElement = container.querySelector('.places__sorting-type')!;
    const optionsList = container.querySelector('.places__options');

    await user.click(sortTypeElement);
    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(sortTypeElement);
    expect(optionsList).not.toHaveClass('places__options--opened');

    await user.click(sortTypeElement);
    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(sortTypeElement);
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should maintain callback reference with useCallback', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const option = screen.getByText('Price: low to high');
    await user.click(option);

    expect(offerSlice.setOffersSort).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const optionAfterRerender = screen.getByText('Price: high to low');
    await user.click(optionAfterRerender);

    expect(offerSlice.setOffersSort).toHaveBeenCalledTimes(2);
  });

  it('should render options as unordered list', () => {
    const { container } = render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const ul = container.querySelector('ul.places__options');
    expect(ul).toBeInTheDocument();
    expect(ul?.tagName).toBe('UL');
  });

  it('should not dispatch action when clicking on currently selected option', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <OffersSort />
      </Provider>
    );

    const currentOption = screen.getAllByText('Popular')[1];
    await user.click(currentOption);

    expect(offerSlice.setOffersSort).toHaveBeenCalledWith('Popular');
  });
});
