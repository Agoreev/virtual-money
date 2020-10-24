import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Hidden,
  Typography,
  ListItem,
  Avatar,
  ListItemText,
  ListItemIcon,
  Drawer,
  makeStyles,
  List,
  Tooltip,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import DashboardIcon from "@material-ui/icons/Dashboard";
import React, { useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import NavigationDrawer from "../../../components/ui/NavigationDrawer";
import Balance from "../../../components/Balance/Balance";
import { IUser } from "../../../store/auth/types";

const useStyles = makeStyles((theme) => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  appBarToolbar: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  accountAvatar: {
    backgroundColor: theme.palette.secondary.main,
    height: 24,
    width: 24,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
  },
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    width: theme.spacing(7),
    overflowX: "hidden",
    marginTop: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    backgroundColor: theme.palette.common.black,
  },
  smBordered: {
    [theme.breakpoints.down("xs")]: {
      borderRadius: "50% !important",
    },
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  iconListItem: {
    width: "auto",
    borderRadius: theme.shape.borderRadius,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  textWhite: {
    color: "white",
  },
  mobileItemSelected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
  },
  username: {
    paddingLeft: 0,
    paddingRight: theme.spacing(2),
  },
  justifyCenter: {
    justifyContent: "center",
  },
  permanentDrawerListItem: {
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

interface INavBarProps {
  user?: IUser | null;
}
const NavBar: React.FC<INavBarProps> = ({ user }) => {
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
      link: "/dashboard",
      name: "Dashboard",
      onClick: closeMobileDrawer,
      icon: {
        desktop: <DashboardIcon fontSize="small" className="text-white" />, //TODO Change color on active state
        mobile: <DashboardIcon className="text-white" />,
      },
    },
    {
      link: "/logout",
      name: "Logout",
      icon: {
        desktop: (
          <PowerSettingsNewIcon className="text-white" fontSize="small" />
        ),
        mobile: <PowerSettingsNewIcon className="text-white" />,
      },
    },
  ];
  return (
    <Fragment>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.appBarToolbar}>
          <Box display="flex" alignItems="center">
            <Hidden smUp>
              <Box mr={1}>
                <IconButton aria-label="Open navigation" color="primary">
                  <MenuIcon onClick={showMobileDrawer} />
                </IconButton>
              </Box>
            </Hidden>
            <Hidden xsDown>
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
            </Hidden>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
          >
            <Box mr={3}>
              <Balance balance={user!.balance} />
            </Box>
            <ListItem
              disableGutters
              className={`${classes.iconListItem} ${classes.smBordered}`}
            >
              <Avatar
                alt="profile picture"
                src=""
                className={classes.accountAvatar}
              />
              <ListItemText
                primary={
                  <Typography color="textPrimary">{user!.name}</Typography>
                }
              />
            </ListItem>
          </Box>
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
        <Drawer
          variant="permanent"
          open={false}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List>
            {menuItems.map((el, idx) => (
              <NavLink
                to={el.link}
                activeClassName="selectedNavLink"
                className={classes.menuLink}
                onClick={el.onClick}
                key={idx}
              >
                <Tooltip title={el.name} placement="right" key={el.name}>
                  <ListItem
                    button
                    divider={idx !== menuItems.length - 1}
                    className={classes.permanentDrawerListItem}
                  >
                    <ListItemIcon className={classes.justifyCenter}>
                      {el.icon.desktop}
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>
              </NavLink>
            ))}
          </List>
        </Drawer>
      </Hidden>
      <NavigationDrawer
        menuItems={menuItems.map((el) => ({
          link: el.link,
          name: el.name,
          icon: el.icon.mobile,
          onClick: el.onClick,
        }))}
        anchor="left"
        open={isMobileOpen}
        onClose={closeMobileDrawer}
      />
    </Fragment>
  );
};

export default NavBar;
