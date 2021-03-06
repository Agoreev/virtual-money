import React, { useEffect, useState } from "react";
import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Redirect } from "react-router-dom";
import { RootState } from "../../store/index";
import {
  createTransactionInit,
  fetchTransactions,
  ITransactionData,
} from "../../store/transactions/actions";
import { getUserInfo, logout } from "../../store/auth/actions";
import NavBar from "./NavBar/NavBar";
import TransactionsView from "./TransactionsView";
import CreateTransactionDialog from "./CreateTransactionDialog/CreateTransactionDialog";

const useStyles = makeStyles((theme) => ({
  main: {
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
}));

const mapStateToProps = (state: RootState) => ({
  transactions: state.transactions.transactions,
  transactionsLoading: state.transactions.loading,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onCreateTransactionInit: () => dispatch(createTransactionInit()),
    onFetchTransactions: () => dispatch(fetchTransactions()),
    onGetUserInfo: () => dispatch(getUserInfo()),
    onLogout: () => dispatch(logout()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Transactions: React.FC<PropsFromRedux> = ({
  onCreateTransactionInit,
  onFetchTransactions,
  onGetUserInfo,
  user,
  onLogout,
  transactions,
  transactionsLoading,
}) => {
  const classes = useStyles();

  //Fetch transactions on page load
  useEffect(() => {
    onGetUserInfo();
    onFetchTransactions();
  }, [onFetchTransactions, onGetUserInfo]);

  const [openCreateTransaction, setOpenCreateTransaction] = useState<boolean>(
    false
  );

  const [transactionValues, setTransactionValues] = useState<ITransactionData>({
    name: "",
    amount: 0,
  });

  const refreshTransactions = () => {
    onGetUserInfo();
    onFetchTransactions();
  };

  const handleOpenCreateTransaction = (
    transactionData?: ITransactionData | null
  ) => {
    if (transactionData) {
      setTransactionValues(transactionData);
    }
    onCreateTransactionInit();
    setOpenCreateTransaction(true);
  };
  const handleCloseCreateTransaction = () => {
    setOpenCreateTransaction(false);
  };

  if (!localStorage.getItem("token")) {
    return <Redirect to="/" />;
  }

  if (!user?.id) {
    return (
      <Box display="flex" mt={3} justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="Transactions">
      <NavBar user={user} logout={onLogout} />
      <Box mt={3}>
        <main className={classes.main}>
          <TransactionsView
            transactions={transactions}
            handleOpenDialog={handleOpenCreateTransaction}
            loading={transactionsLoading}
            refreshTransactions={refreshTransactions}
          />
        </main>
      </Box>
      <CreateTransactionDialog
        open={openCreateTransaction}
        onClose={handleCloseCreateTransaction}
        title="CREATE TRANSACTION"
        transactionValues={transactionValues}
      />
    </div>
  );
};

export default connector(Transactions);
