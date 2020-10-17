import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

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
}));

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <header className="Header">
      <AppBar elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h4" noWrap className={classes.toolbarTitle}>
            Virtual money
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
