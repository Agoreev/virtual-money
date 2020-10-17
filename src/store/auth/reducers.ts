import {
  UserState,
  AUTH_START,
  AUTH_FAILED,
  LOGOUT,
  AUTH_SUCCESS,
  authActionTypes,
} from "./types";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action: authActionTypes): UserState => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        user: { ...action.payload },
        loading: false,
        error: null,
      };
    case AUTH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default reducer;
