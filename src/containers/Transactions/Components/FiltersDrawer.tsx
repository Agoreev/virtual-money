import React from "react";
import {
  Drawer,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import CloseIcon from "@material-ui/icons/Close";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import TypeSwitch from "./TypeSwitch";
import { IFilter } from "../TransactionsView";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minWidth: 240,
  },
}));

interface IFiltersDrawer {
  open: boolean;
  onClose: () => void;
  filter: IFilter;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateFilterChange: (date: Date | null) => void;
  handleResetFilter: () => void;
}

const FiltersDrawer: React.FC<IFiltersDrawer> = ({
  onClose,
  open,
  filter,
  handleFilterChange,
  handleDateFilterChange,
  handleResetFilter,
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
          <TypeSwitch
            type={{ debet: filter.debet, credit: filter.credit }}
            handleChange={handleFilterChange}
          />
          <Divider />
          <Box mb={2} mt={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                format="MM/dd/yyyy"
                disableFuture
                autoOk
                name="date"
                size="small"
                inputVariant="outlined"
                label="Date"
                value={filter.date}
                onChange={handleDateFilterChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mb={2}>
            <TextField
              variant="outlined"
              size="small"
              label="Name"
              fullWidth
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
            />
          </Box>
          <Box mb={2}>
            <TextField
              variant="outlined"
              label="Amount"
              size="small"
              fullWidth
              name="amount"
              type="number"
              value={filter.amount}
              onChange={handleFilterChange}
            />
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResetFilter}
            startIcon={<ClearAllIcon />}
          >
            Reset filter
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FiltersDrawer;
