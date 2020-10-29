import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

interface IProfileMenu {
  handleClose: () => void;
  logout: () => void;
  anchorEl: null | HTMLElement;
}

const ProfileMenu: React.FC<IProfileMenu> = ({
  handleClose,
  logout,
  anchorEl,
}) => {
  return (
    <div>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
