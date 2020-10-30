import {
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
  CREATE_TRANSACTION_INIT,
  CREATE_TRANSACTION_EXITED,
} from "./types";

const initialState: TransactionsState = {
  transactions: [],
  createLoading: false,
  createSuccess: false,
  loading: false,
  error: null,
};

const reducer = (
  state = initialState,
  action: createTransactionActionTypes | fetchTransactionActionTypes
): TransactionsState => {
  switch (action.type) {
    case CREATE_TRANSACTION_INIT:
      return {
        ...state,
        createSuccess: false,
      };
    case CREATE_TRANSACTION_START:
      return {
        ...state,
        createLoading: true,
        error: null,
      };
    case CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createSuccess: true,
        error: null,
      };
    case CREATE_TRANSACTION_FAILED:
      return {
        ...state,
        createLoading: false,
        error: action.payload,
      };
    case CREATE_TRANSACTION_ERROR_CLEAR:
      return {
        ...state,
        error: null,
      };
    case FETCH_TRANSACTIONS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    case FETCH_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_TRANSACTION_EXITED:
      return {
        ...state,
        createSuccess: false,
      };
    default:
      return state;
  }
};

export default reducer;
