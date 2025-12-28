import React from 'react';
import { RootState } from '../../hooks/use-store.ts';
import { LoginForm } from './components/login-form.tsx';
import { Header } from '../../components/header.tsx';
import { useSelector } from 'react-redux';

export const Login: React.FC = () => {
  const { city } = useSelector((state: RootState) => state.city);

  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>

            <LoginForm />
          </section>

          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>{city.name}</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
