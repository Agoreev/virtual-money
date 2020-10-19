import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";

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

interface IHeaderProps {
  handleOpenRegister: () => void;
  handleOpenLogin: () => void;
}

const Header: React.FC<IHeaderProps> = ({
  handleOpenLogin,
  handleOpenRegister,
}) => {
  const classes = useStyles();

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
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
