export interface ITransaction {
  id: number;
  date: string;
  username: string;
  amount: number;
  balance: number;
}

export interface TransactionsState {
  transactions: ITransaction[];
  createSuccess: boolean;
  loading: boolean;
  createLoading: boolean;
  error?: string | null;
}

export const CREATE_TRANSACTION_INIT = "CREATE_TRANSACTION_INIT";
export const CREATE_TRANSACTION_START = "CREATE_TRANSACTION_START";
export const CREATE_TRANSACTION_SUCCESS = "CREATE_TRANSACTION_SUCCESS";
export const CREATE_TRANSACTION_FAILED = "CREATE_TRANSACTION_FAILED";
export const CREATE_TRANSACTION_ERROR_CLEAR = "CREATE_TRANSACTION_ERROR_CLEAR";
export const CREATE_TRANSACTION_EXITED = "CREATE_TRANSACTION_EXITED";

export const FETCH_TRANSACTIONS_START = "FETCH_TRANSACTIONS_START";
export const FETCH_TRANSACTIONS_SUCCESS = "FETCH_TRANSACTIONS_SUCCESS";
export const FETCH_TRANSACTIONS_FAILED = "FETCH_TRANSACTIONS_FAILED";

interface createTransactionInit {
  type: typeof CREATE_TRANSACTION_INIT;
}

interface createTransactionExited {
  type: typeof CREATE_TRANSACTION_EXITED;
}

interface createTransactionStart {
  type: typeof CREATE_TRANSACTION_START;
}

interface createTransactionSuccess {
  type: typeof CREATE_TRANSACTION_SUCCESS;
}

interface createTransactionFailed {
  type: typeof CREATE_TRANSACTION_FAILED;
  payload: string;
}

interface createTransactionErrorClear {
  type: typeof CREATE_TRANSACTION_ERROR_CLEAR;
}

interface fetchTransactionsStart {
  type: typeof FETCH_TRANSACTIONS_START;
}

interface fetchTransactionsSuccess {
  type: typeof FETCH_TRANSACTIONS_SUCCESS;
  payload: ITransaction[];
}

interface fetchTransactionsFailed {
  type: typeof FETCH_TRANSACTIONS_FAILED;
  payload: string;
}

export type createTransactionActionTypes =
  | createTransactionInit
  | createTransactionStart
  | createTransactionSuccess
  | createTransactionFailed
  | createTransactionErrorClear
  | createTransactionExited;

export type fetchTransactionActionTypes =
  | fetchTransactionsStart
  | fetchTransactionsSuccess
  | fetchTransactionsFailed;
