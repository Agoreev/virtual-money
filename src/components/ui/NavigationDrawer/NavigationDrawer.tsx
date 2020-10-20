import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Typography,
  withWidth,
  isWidthUp,
  withStyles,
  Toolbar,
  Theme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme: Theme) => ({
  closeIcon: {
    marginRight: theme.spacing(0.5),
  },
  headSection: {
    width: 200,
  },
  blackList: {
    backgroundColor: theme.palette.common.black,
    height: "100%",
  },
  noDecoration: {
    textDecoration: "none !important",
  },
});

interface INavigationDrawer {
  open: boolean;
  onClose: () => void;
  anchor: "left" | "right";
  menuItems: any[];
  width: any;
  classes: any;
  theme: Theme;
}

const NavigationDrawer: React.FC<INavigationDrawer> = ({
  open,
  onClose,
  anchor,
  menuItems,
  width,
  classes,
  theme,
}) => {
  useEffect(() => {
    window.onresize = () => {
      if (isWidthUp("sm", width) && open) {
        onClose();
      }
    };
  }, [width, open, onClose]);

  return (
    <Drawer variant="temporary" open={open} onClose={onClose} anchor={anchor}>
      <Toolbar className={classes.headSection}>
        <ListItem
          style={{
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
            height: "100%",
            justifyContent: anchor === "left" ? "flex-start" : "flex-end",
          }}
          disableGutters
        >
          <ListItemIcon className={classes.closeIcon}>
            <IconButton onClick={onClose} aria-label="Close Navigation">
              <CloseIcon color="primary" />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Toolbar>
      <List className={classes.blackList}>
        {menuItems.map((element) => {
          if (element.link) {
            return (
              <NavLink
                key={element.name}
                to={element.link}
                activeClassName="selectedNavLink"
                className={classes.noDecoration}
                onClick={onClose}
              >
                <ListItem button disableRipple disableTouchRipple>
                  <ListItemIcon>{element.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" className="text-white">
                        {element.name}
                      </Typography>
                    }
                  />
                </ListItem>
              </NavLink>
            );
          }
          return (
            <ListItem button key={element.name} onClick={element.onClick}>
              <ListItemIcon>{element.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" className="text-white">
                    {element.name}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(NavigationDrawer)
);
