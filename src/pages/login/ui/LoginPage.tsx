import { useEffect, useState, type FC, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  authFailed,
  authFinished,
  authStarted,
  authSucceeded,
  clearAuthError,
  loginRequest,
} from '@/entities/session';
import { ROUTES } from '@/shared/config';
import { setStoredAuth } from '@/shared/lib';
import {
  getApiErrorMessage,
  getApiErrorStatus,
} from '@/shared/lib/apiError';
import { requestFinished, requestStarted } from '@/shared/model';

import './LoginPage.css';

interface LoginLocationState {
  from?: string;
}

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.session,
  );
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const from = (location.state as LoginLocationState | null)?.from;

  if (isAuthenticated) {
    return <Navigate to={from ?? ROUTES.FEED} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!login.trim() || !password) {
      setValidationError('Введите логин и пароль');
      return;
    }

    dispatch(authStarted());
    dispatch(requestStarted());

    try {
      const auth = await loginRequest(login.trim(), password);

      setStoredAuth(auth);
      dispatch(authSucceeded(auth));
      navigate(from ?? ROUTES.FEED, { replace: true });
    } catch (submitError) {
      const status = getApiErrorStatus(submitError);
      const message =
        status === 403
          ? 'Неверный логин или пароль'
          : getApiErrorMessage(submitError, 'Не удалось войти');

      dispatch(authFailed(message));
    } finally {
      dispatch(authFinished());
      dispatch(requestFinished());
    }
  };

  return (
    <main className="loginPage">
      <h1 className="loginTitle">Вход</h1>

      <form className="loginCard" onSubmit={handleSubmit}>
        <label className="loginField">
          <span className="loginLabel">Логин</span>
          <input
            className="loginInput"
            type="text"
            autoComplete="username"
            value={login}
            onChange={(event) => {
              setLogin(event.currentTarget.value);
              setValidationError(null);
              dispatch(clearAuthError());
            }}
          />
        </label>

        <label className="loginField">
          <span className="loginLabel">Пароль</span>
          <input
            className="loginInput"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              setValidationError(null);
              dispatch(clearAuthError());
            }}
          />
        </label>

        {validationError || error ? (
          <div className="loginError" role="alert">
            {validationError ?? error}
          </div>
        ) : null}

        <button
          type="submit"
          className="loginButton"
          disabled={isLoading}
        >
          Войти
        </button>
      </form>

      <Link className="loginBack" to={ROUTES.FEED}>
        Вернуться в ленту
      </Link>
    </main>
  );
};
