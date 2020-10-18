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
export const LOGOUT = "LOGOUT";

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

interface logoutAction {
  type: typeof LOGOUT;
}

export type authActionTypes =
  | authStartAction
  | authSuccessAction
  | authFailedAction
  | logoutAction;
