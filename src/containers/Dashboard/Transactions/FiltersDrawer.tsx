import React from "react";
import {
  Drawer,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Box,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TypeSwitch from "./TypeSwitch";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minWidth: 240,
  },
}));

interface IFiltersDrawer {
  open: boolean;
  onClose: () => void;
  filterType: { debet: boolean; credit: boolean };
  handleFilterTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FiltersDrawer: React.FC<IFiltersDrawer> = ({
  onClose,
  open,
  filterType,
  handleFilterTypeChange,
}) => {
  const classes = useStyles();
  return (
    <Drawer anchor="right" open={open} variant="temporary" onClose={onClose}>
      <Toolbar disableGutters className={classes.toolbar}>
        <Box
          pl={3}
          pr={3}
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography variant="h6">Filters and sorting</Typography>
          <IconButton
            onClick={onClose}
            color="primary"
            aria-label="Close Sidedrawer"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Divider />
      <Box p={2} display="flex" flexDirection="column" width="100%">
        <Box mb={2}>
          <Typography variant="subtitle1">Transaction types</Typography>
          <TypeSwitch type={filterType} handleChange={handleFilterTypeChange} />
        </Box>

        <Divider />
      </Box>
    </Drawer>
  );
};

export default FiltersDrawer;
