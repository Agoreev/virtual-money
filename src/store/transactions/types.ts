export interface ITransaction {
  id: number;
  date: Date;
  username: string;
  amount: number;
  balance: number;
}

export interface TransactionsState {
  transactions: ITransaction[];
  loading: boolean;
  error?: string | null;
}

export const CREATE_TRANSACTION_START = "CREATE_TRANSACTION_START";
export const CREATE_TRANSACTION_SUCCESS = "CREATE_TRANSACTION_SUCCESS";
export const CREATE_TRANSACTION_FAILED = "CREATE_TRANSACTION_FAILED";

export const FETCH_TRANSACTIONS_START = "FETCH_TRANSACTIONS_START";
export const FETCH_TRANSACTIONS_SUCCESS = "FETCH_TRANSACTIONS_SUCCESS";
export const FETCH_TRANSACTIONS_FAILED = "FETCH_TRANSACTIONS_FAILED";

interface createTransactionStart {
  type: typeof CREATE_TRANSACTION_START;
}

interface createTransactionSuccess {
  type: typeof CREATE_TRANSACTION_SUCCESS;
  payload: ITransaction;
}

interface createTransactionFailed {
  type: typeof CREATE_TRANSACTION_FAILED;
  payload: string;
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
  | createTransactionStart
  | createTransactionSuccess
  | createTransactionFailed;

export type fetchTransactionActionTypes =
  | fetchTransactionsStart
  | fetchTransactionsSuccess
  | fetchTransactionsFailed;
