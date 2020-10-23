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
} from "./types";

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const reducer = (
  state = initialState,
  action: createTransactionActionTypes | fetchTransactionActionTypes
): TransactionsState => {
  switch (action.type) {
    case CREATE_TRANSACTION_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        loading: false,
        error: null,
      };
    case CREATE_TRANSACTION_FAILED:
      return {
        ...state,
        loading: false,
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
        error: null,
      };
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
