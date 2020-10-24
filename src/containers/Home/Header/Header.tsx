import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import NavigationDrawer from "../../../components/ui/NavigationDrawer";

const useStyles = makeStyles((theme) => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  menuButtonText: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
  },
  noDecoration: {
    textDecoration: "none !important",
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

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobileDrawer = () => {
    setIsMobileOpen(false);
  };

  const showMobileDrawer = () => {
    setIsMobileOpen(true);
  };

  const menuItems = [
    {
      link: "/",
      name: "Home",
      icon: <HomeIcon className="text-white" />,
    },
    {
      name: "Register",
      onClick: handleOpenRegister,
      icon: <HowToRegIcon className="text-white" />,
    },
    {
      name: "Login",
      onClick: handleOpenLogin,
      icon: <LockOpenIcon className="text-white" />,
    },
  ];

  return (
    <header className="Header">
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography
              variant="h4"
              display="inline"
              color="primary"
              className={classes.brandText}
            >
              Virtual
            </Typography>
            <Typography
              variant="h4"
              display="inline"
              color="secondary"
              className={classes.brandText}
            >
              Money
            </Typography>
          </div>
          <div>
            <Hidden mdUp>
              <IconButton
                edge="start"
                onClick={showMobileDrawer}
                color="primary"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden smDown>
              {menuItems.map((element) => {
                if (element.link) {
                  return (
                    <Link
                      key={element.name}
                      to={element.link}
                      className={classes.noDecoration}
                      onClick={closeMobileDrawer}
                    >
                      <Button
                        color="secondary"
                        size="large"
                        classes={{ text: classes.menuButtonText }}
                      >
                        {element.name}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Button
                    color="secondary"
                    size="large"
                    onClick={element.onClick}
                    classes={{ text: classes.menuButtonText }}
                    key={element.name}
                  >
                    {element.name}
                  </Button>
                );
              })}
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        menuItems={menuItems}
        anchor="right"
        open={isMobileOpen}
        onClose={closeMobileDrawer}
      />
    </header>
  );
};

export default Header;
