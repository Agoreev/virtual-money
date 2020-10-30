export interface UserState {
  user?: IUser | null;
  loading: boolean;
  error?: string | null;
}

export interface IUser {
  id?: string;
  name?: string | null;
  token?: string | null;
  balance: number;
  email?: string | null;
}

export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAILED = "AUTH_FAILED";
export const AUTH_ERROR_CLEAR = "AUTH_ERROR_CLEAR";
export const LOGOUT = "LOGOUT";

export const BALANCE_CHANGE = "BALANCE_CHANGE";

interface authStartAction {
  type: typeof AUTH_START;
}

interface authSuccessAction {
  type: typeof AUTH_SUCCESS;
  payload: IUser;
}

interface authFailedAction {
  type: typeof AUTH_FAILED;
  payload: string;
}

interface authErrorClear {
  type: typeof AUTH_ERROR_CLEAR;
}

interface logoutAction {
  type: typeof LOGOUT;
}

export type authActionTypes =
  | authStartAction
  | authSuccessAction
  | authFailedAction
  | authErrorClear
  | logoutAction;
