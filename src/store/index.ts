import { combineReducers } from "redux";

import authReducer from "./auth/reducers";
import transactionsReducer from "./transactions/reducers";

export const rootReducer = combineReducers({
  auth: authReducer,
  transactions: transactionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
