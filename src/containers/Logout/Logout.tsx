import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";
import { Dispatch } from "redux";
import { logout } from "../../store/auth/actions";
import { authActionTypes } from "../../store/auth/types";
import { createTransactionExited } from "../../store/transactions/actions";
import { createTransactionActionTypes } from "../../store/transactions/types";

const mapDispatchToProps = (
  dispatch: Dispatch<authActionTypes | createTransactionActionTypes>
) => {
  return {
    onLogout: () => dispatch(logout()),
    onCreateTransactionExited: () => dispatch(createTransactionExited()),
  };
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Logout: React.FC<PropsFromRedux> = ({
  onLogout,
  onCreateTransactionExited,
}) => {
  useEffect(() => {
    onCreateTransactionExited();
    onLogout();
  }, [onLogout, onCreateTransactionExited]);
  return <Redirect to="/" />;
};

export default connector(Logout);
