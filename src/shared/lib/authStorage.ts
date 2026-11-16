const AUTH_STORAGE_KEY = 'licensing-auth';

export interface StoredAuth {
  token: string;
  login: string;
}

export const getStoredAuth = (): StoredAuth | null => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredAuth>;

    if (typeof parsed.token !== 'string' || typeof parsed.login !== 'string') {
      return null;
    }

    return { token: parsed.token, login: parsed.login };
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth: StoredAuth): void => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = (): void => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
