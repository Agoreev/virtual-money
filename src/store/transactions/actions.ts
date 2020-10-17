import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  ITransaction,
  CREATE_TRANSACTION_START,
  CREATE_TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_FAILED,
  createTransactionActionTypes,
  fetchTransactionActionTypes,
  TransactionsState,
  FETCH_TRANSACTIONS_START,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILED,
} from "./types";
import { logout } from "../auth/actions";
import { baseURL } from "../../api/api";

const createTransactionStart = (): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_START,
  };
};

const createTransactionSuccess = (
  transaction: ITransaction
): createTransactionActionTypes => {
  return {
    type: CREATE_TRANSACTION_SUCCESS,
    payload: transaction,
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

interface ITransactionData {
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
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const transactionJSON = await transactionResp.json();
      const transaction: ITransaction = transactionJSON["trans_token"];
      dispatch(createTransactionSuccess(transaction));
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
      //2. Send user info request to the API
      const transactionsResp = await fetch(
        baseURL + "/api/protected/transactions",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const transactionsJSON = await transactionsResp.json();
      const transactions: ITransaction[] = transactionsJSON["trans_token"];
      //3. Dispatch auth success action with user info
      dispatch(fetchTransactionsSuccess(transactions));
    } catch (error) {
      console.log(error);
      dispatch(fetchTransactionsFailed(error));
      dispatch(logout);
    }
  }
};
