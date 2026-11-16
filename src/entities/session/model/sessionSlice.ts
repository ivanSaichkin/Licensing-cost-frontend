import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getStoredAuth } from '@/shared/lib/authStorage';

import type { AuthPayload, SessionState } from './types';

const storedAuth = getStoredAuth();

const initialState: SessionState = {
  token: storedAuth?.token ?? null,
  login: storedAuth?.login ?? null,
  isAuthenticated: Boolean(storedAuth?.token),
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    authStarted(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSucceeded(state, action: PayloadAction<AuthPayload>) {
      state.token = action.payload.token;
      state.login = action.payload.login;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    authFinished(state) {
      state.isLoading = false;
    },
    loggedOut(state) {
      state.token = null;
      state.login = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  authStarted,
  authSucceeded,
  authFailed,
  authFinished,
  loggedOut,
  clearAuthError,
} = sessionSlice.actions;

export default sessionSlice.reducer;
