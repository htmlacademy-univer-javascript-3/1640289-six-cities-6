import { CitiesList } from '../../../components/city-list.tsx';
import { Header } from '../../../components/header.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../../hooks/use-store.ts';

export const MainEmpty = () => {
  const { city } = useSelector((state: RootState) => state.city);

  return(
    <div className="page page--gray page--main">
      <Header />

      <main className="page__main page__main--index page__main--index-empty">
        <h1 className="visually-hidden">Cities</h1>

        <CitiesList />

        <div className="cities">
          <div className="cities__places-container cities__places-container--empty container">
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">No places to stay available</b>
                <p className="cities__status-description">We could not find any property available at the moment in {city.name}</p>
              </div>
            </section>
            <div className="cities__right-section"></div>
          </div>
        </div>
      </main>
    </div>
  );
};
