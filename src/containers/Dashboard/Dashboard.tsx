import React, { useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Redirect } from "react-router-dom";
import { RootState } from "../../store/index";
import {
  createTransaction,
  fetchTransactions,
  ITransactionData,
} from "../../store/transactions/actions";
import { getUserInfo } from "../../store/auth/actions";
import NavBar from "./NavBar/NavBar";
import TransactionsTable from "./TransactionsTable/TransactionsTable";

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
  transactionsError: state.transactions.error,
  userLoading: state.auth.loading,
  userError: state.auth.error,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onCreateTransaction: (data: ITransactionData) =>
      dispatch(createTransaction(data)),
    onFetchTransactions: () => dispatch(fetchTransactions()),
    onGetUserInfo: () => dispatch(getUserInfo()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  onCreateTransaction,
  onFetchTransactions,
  onGetUserInfo,
  user,
  transactions,
  transactionsLoading,
  transactionsError,
  userLoading,
  userError,
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (!user?.id) {
      onGetUserInfo();
    }
    onFetchTransactions();
  }, [onFetchTransactions, onGetUserInfo, user]);

  if (!localStorage.getItem("token")) {
    return <Redirect to="/" />;
  }

  if (userLoading || !user?.id) {
    return (
      <Box display="flex" mt={3} justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div className="Dashboard">
      <NavBar user={user} />
      <Box mt={3}>
        <main className={classes.main}>
          <Container maxWidth="md">
            <TransactionsTable
              transactions={transactions}
              onCreateTransaction={onCreateTransaction}
              loading={transactionsLoading}
              error={transactionsError}
            />
          </Container>
        </main>
      </Box>
    </div>
  );
};

export default connector(Dashboard);
