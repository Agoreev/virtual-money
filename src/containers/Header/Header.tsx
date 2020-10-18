import React, { useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import LoginFormDialog from "../Auth/LoginFormDialog";
import RegisterFormDialog from "../Auth/RegisterFormDialog";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
    transform: "skew(-10deg)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();

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
    <header className="Header">
      <AppBar elevation={0}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            noWrap
            className={classes.toolbarTitle}
            color="inherit"
          >
            Virtual money
          </Typography>
          <Button color="inherit" onClick={handleOpenRegister}>
            Register
          </Button>
          <Button color="inherit" onClick={handleOpenLogin}>
            Login
          </Button>
          <LoginFormDialog open={openLogin} onClose={handleCloseLogin} />
          <RegisterFormDialog
            open={openRegister}
            onClose={handleCloseRegister}
          />
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
