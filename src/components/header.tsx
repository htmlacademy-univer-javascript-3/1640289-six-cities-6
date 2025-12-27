import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../hooks/use-store.ts';
import {RoutePath} from '../shared/constants/router.ts';
import {AuthStatus} from '../shared/constants/auth.ts';
import {authLogout} from '../store/actions/auth.ts';

export const Header: React.FC = () => {
  const authStatus = useAppSelector((state) => state.authorizationStatus);
  const name = useAppSelector((state) => state.name);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
              {authStatus === AuthStatus.Auth && (
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span className="header__user-name user__name">{name}</span>
                    {/* TODO: Add favorite-count */}
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
              )}

              {authStatus === AuthStatus.Auth ? (
                <li className="header__nav-item">
                  <Link
                    to={RoutePath.Main}
                    className="header__nav-link"
                    onClick={(e) => {
                      e.preventDefault();

                      dispatch(authLogout({navigate}));
                    }}
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
