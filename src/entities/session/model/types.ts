export interface SessionState {
  token: string | null;
  login: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthPayload {
  token: string;
  login: string;
}

export interface LoginResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}
