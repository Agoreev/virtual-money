import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import Header from "./Header/Header";
import AuthFormDialog from "./Auth/AuthFormDialog";
import { dialogType } from "../../interfaces";
import { RootState } from "../../store/index";
import { getUserInfo } from "../../store/auth/actions";

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: !!state.auth.user?.id,
});
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, any, any>) => {
  return {
    onGetUserInfo: () => dispatch(getUserInfo()),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home: React.FC<PropsFromRedux> = ({ isLoggedIn, onGetUserInfo }) => {
  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      onGetUserInfo();
    }
  }, [onGetUserInfo]);
  let authRedirect = null;
  if (isLoggedIn) {
    authRedirect = <Redirect to="/dashboard" />;
  }
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };
  const handleOpenRegister = () => {
    setOpenRegister(true);
  };
  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
    <div className="Home">
      {authRedirect}
      <Header
        handleOpenLogin={handleOpenLogin}
        handleOpenRegister={handleOpenRegister}
      />
      <AuthFormDialog
        open={openLogin}
        onClose={handleCloseLogin}
        title="LOGIN"
        dialogType={dialogType.login}
      />
      <AuthFormDialog
        open={openRegister}
        onClose={handleCloseRegister}
        title="REGISTER"
        dialogType={dialogType.register}
      />
    </div>
  );
};

export default connector(Home);
