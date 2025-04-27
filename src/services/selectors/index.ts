import { RootState } from '../store';

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken || state.auth.user);

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
