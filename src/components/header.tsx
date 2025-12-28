import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RootState, useAppDispatch } from '../hooks/use-store.ts';
import { RoutePath } from '../shared/constants/router.ts';
import { AuthStatus } from '../shared/constants/auth.ts';
import { authLogout } from '../store/actions/auth.ts';
import { useSelector } from 'react-redux';

export const Header: React.FC = () => {
  const { authorizationStatus, name } = useSelector((state: RootState) => state.auth);
  const { offerFavorites } = useSelector((state: RootState) => state.favorites);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(authLogout({ navigate }));
    },
    [dispatch, navigate]
  );

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link to={RoutePath.Main}>
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>

          <nav className="header__nav">
            <ul className="header__nav-list">
              {authorizationStatus === AuthStatus.Auth && (
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <Link to={RoutePath.Favorites}>
                      <span className="header__user-name user__name">{name}</span>
                    </Link>
                    <span className="header__favorite-count">{offerFavorites.length}</span>
                  </a>
                </li>
              )}

              {authorizationStatus === AuthStatus.Auth ? (
                <li className="header__nav-item">
                  <Link
                    to={RoutePath.Main}
                    className="header__nav-link"
                    onClick={handleLogout}
                  >
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              ) : (
                <li className="header__nav-item">
                  <Link
                    to={RoutePath.Login}
                    className="header__nav-link"
                  >
                    <span className="header__signout">Sign in</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
