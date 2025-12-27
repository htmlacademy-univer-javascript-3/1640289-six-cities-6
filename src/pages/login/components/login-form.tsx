import React, { useState } from 'react';
import {useAppDispatch} from '../../../hooks/use-store.ts';
import {authLogin} from '../../../store/actions/auth.ts';
import {useNavigate} from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.length && password.length) {
      dispatch(authLogin({payload: { email, password }, navigate }));
    }
  };


  return (
    <form className="login__form form" onSubmit={handleSubmit}>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">E-mail</label>
        <input
          className="login__input form__input"
          value={email}
          onChange={handleEmailChange}
          type="email"
          name="email"
          placeholder="Email"
          required
        />
      </div>

      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">Password</label>
        <input
          className="login__input form__input"
          value={password}
          onChange={handlePasswordChange}
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>

      <button className="login__submit form__submit button" type="submit">Sign in</button>
    </form>
  );
};
