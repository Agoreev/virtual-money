import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  ITransaction,
  CREATE_TRANSACTION_INIT,
  CREATE_TRANSACTION_START,
  CREATE_TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_FAILED,
  createTransactionActionTypes,
  fetchTransactionActionTypes,
  TransactionsState,
  FETCH_TRANSACTIONS_START,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILED,
  CREATE_TRANSACTION_ERROR_CLEAR,
  CREATE_TRANSACTION_EXITED,
} from "./types";
import { logout, getUserInfo } from "../auth/actions";
import { baseURL } from "../../api/api";

export const createTransactionInit = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_INIT,
  };
};

const createTransactionStart = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_START,
  };
};

const createTransactionSuccess = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_SUCCESS,
  };
};

const createTransactionFailed = (
  error: string
): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_FAILED,
    payload: error,
  };
};

export const createTransactionErrorClear = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_ERROR_CLEAR,
  };
};

export const createTransactionExited = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_EXITED,
  };
};

export interface ITransactionData {
  name: string;
  amount: number;
}

export const createTransaction = (
  data: ITransactionData
): ThunkAction<void, TransactionsState, unknown, Action<string>> => async (
  dispatch
) => {
  dispatch(createTransactionStart());
  const token: string | null = localStorage.getItem("token");
  if (token) {
    try {
      const transactionResp = await fetch(
        baseURL + "/api/protected/transactions",
        {
          method: "POST",
          body: JSON.stringify({
            ...data,
          }),
          credentials: "include",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      if (!transactionResp.ok) {
        const error: string = await transactionResp.text();
        //Dispatch get user info to refresh balance
        dispatch(getUserInfo());
        dispatch(fetchTransactions());
        dispatch(createTransactionFailed(error));
      } else {
        dispatch(getUserInfo());
        dispatch(fetchTransactions());
        dispatch(createTransactionSuccess());
      }
    } catch (error) {
      console.log(error);
      dispatch(createTransactionFailed(error));
    }
  } else {
    dispatch(createTransactionFailed("Not authorized"));
    dispatch(logout());
  }
};

const fetchTransactionsStart = (): fetchTransactionActionTypes => {
  return {
    type: FETCH_TRANSACTIONS_START,
  };
};

const fetchTransactionsSuccess = (
  transactions: ITransaction[]
): fetchTransactionActionTypes => {
  return {
    type: FETCH_TRANSACTIONS_SUCCESS,
    payload: transactions,
  };
};

const fetchTransactionsFailed = (
  error: string
): fetchTransactionActionTypes => {
  return {
    type: FETCH_TRANSACTIONS_FAILED,
    payload: error,
  };
};

export const fetchTransactions = (): ThunkAction<
  void,
  TransactionsState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch(fetchTransactionsStart());
  const token: string | null = localStorage.getItem("token");
  if (token) {
    try {
      //1. Send transactions request to the API
      const transactionsResp = await fetch(
        baseURL + "/api/protected/transactions",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      if (!transactionsResp.ok) {
        const error: string = await transactionsResp.text();
        dispatch(fetchTransactionsFailed(error));
      } else {
        const transactionsJSON = await transactionsResp.json();
        const transactions: ITransaction[] = transactionsJSON["trans_token"];
        //2. Dispatch transactions success action with transactions
        dispatch(fetchTransactionsSuccess(transactions));
      }
    } catch (error) {
      console.log(error);
      dispatch(fetchTransactionsFailed(error));
      dispatch(logout);
    }
  }
};
