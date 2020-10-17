import { ThunkAction } from "redux-thunk";
import {
  IUser,
  UserState,
  AUTH_START,
  AUTH_FAILED,
  LOGOUT,
  AUTH_SUCCESS,
  authActionTypes,
} from "./types";
import { Action } from "redux";
import { baseURL } from "../../api/api";

const authStart = (): authActionTypes => {
  return {
    type: AUTH_START,
  };
};

const authSuccess = (user: IUser) => {
  return {
    type: AUTH_SUCCESS,
    payload: user,
  };
};

const authFailed = (error: string) => {
  return {
    type: AUTH_FAILED,
    payload: error,
  };
};

export const logout = (): authActionTypes => {
  localStorage.removeItem("token");
  return {
    type: LOGOUT,
  };
};

interface IAuthData {
  email: string;
  name?: string;
  password: String;
}

export const auth = (
  authData: IAuthData,
  isSignUp: Boolean
): ThunkAction<void, UserState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(authStart());
  let url: string, body: IAuthData;
  //1. Check if register or login
  if (isSignUp) {
    url = "/users";
    body = {
      ...authData,
    };
  } else {
    url = "/sessions/create";
    body = {
      email: authData.email,
      password: authData.password,
    };
  }
  try {
    //2. Send auth request to the API
    const authResp = await fetch(baseURL + url, {
      method: "POST",
      body: JSON.stringify({
        ...body,
      }),
    });
    const { token } = await authResp.json();

    //3. Set token in local storage
    localStorage.setItem("token", token);

    //4. Dispatch get user info thunk action
    dispatch(getUserInfo());
  } catch (error) {
    console.log(error);
    dispatch(authFailed(error));
  }
};

export const getUserInfo = (): ThunkAction<
  void,
  UserState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch(authStart());
  //1. Check token
  const token: string | null = localStorage.getItem("token");
  if (!token) {
    dispatch(logout);
  } else {
    try {
      //2. Send user info request to the API
      const userResp = await fetch(baseURL + "/api/protected/user-info", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const user: IUser = await userResp.json();

      //3. Dispatch auth success action with user info
      dispatch(authSuccess(user));
    } catch (error) {
      console.log(error);
      dispatch(authFailed(error));
      dispatch(logout);
    }
  }
};
