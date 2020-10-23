import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";
import { Dispatch } from "redux";
import { logout } from "../../store/auth/actions";
import { authActionTypes } from "../../store/auth/types";

const mapDispatchToProps = (dispatch: Dispatch<authActionTypes>) => {
  return {
    onLogout: () => dispatch(logout()),
  };
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Logout: React.FC<PropsFromRedux> = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);
  return <Redirect to="/" />;
};

export default connector(Logout);
