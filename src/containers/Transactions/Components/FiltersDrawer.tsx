import React from "react";
import {
  SwipeableDrawer,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
  MenuItem,
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

export enum sortingTypes {
  dateDescending = "dateDescending",
  dateAscending = "dateAscending",
  nameDescending = "nameDescending",
  nameAscending = "nameAscending",
  amountDescending = "amountDescending",
  amountAscending = "amountAscending",
}
interface IFiltersDrawer {
  open: boolean;
  toggle: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  filter: IFilter;
  users: string[];
  handleFilterChange: (event: React.ChangeEvent<any>) => void;
  handleToDateFilterChange: (date: Date | null) => void;
  handleFromDateFilterChange: (date: Date | null) => void;
  handleResetFilter: () => void;
  handleSortChange: (event: React.ChangeEvent<any>) => void;
}

const FiltersDrawer: React.FC<IFiltersDrawer> = ({
  toggle,
  open,
  filter,
  users,
  handleFilterChange,
  handleToDateFilterChange,
  handleFromDateFilterChange,
  handleResetFilter,
  handleSortChange,
}) => {
  const classes = useStyles();
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      variant="temporary"
      onClose={toggle(false)}
      onOpen={toggle(true)}
    >
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
            onClick={toggle(false)}
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
          <Box mb={2}>
            <TextField
              select
              size="small"
              variant="outlined"
              label="Sort"
              fullWidth
              name="sort"
              defaultValue={sortingTypes.dateDescending}
              onChange={handleSortChange}
            >
              <MenuItem value={sortingTypes.dateDescending}>
                By date descending
              </MenuItem>
              <MenuItem value={sortingTypes.dateAscending}>
                By date ascending
              </MenuItem>
              <MenuItem value={sortingTypes.nameDescending}>
                By name descending
              </MenuItem>
              <MenuItem value={sortingTypes.nameAscending}>
                By name ascending
              </MenuItem>
              <MenuItem value={sortingTypes.amountDescending}>
                By amount descending
              </MenuItem>
              <MenuItem value={sortingTypes.amountAscending}>
                By amount descending
              </MenuItem>
            </TextField>
          </Box>
          <Divider />
          <Box mb={2} mt={2}>
            <Typography variant="subtitle1">Transaction types</Typography>
            <TypeSwitch
              type={{ debet: filter.debet, credit: filter.credit }}
              handleChange={handleFilterChange}
            />
          </Box>
          <Divider />
          <Box mb={2} mt={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                format="dd/MM/yyyy"
                disableFuture
                autoOk
                name="fromDate"
                size="small"
                inputVariant="outlined"
                label="Date from"
                value={filter.fromDate}
                onChange={handleFromDateFilterChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mb={2} mt={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                format="dd/MM/yyyy"
                disableFuture
                autoOk
                name="toDate"
                size="small"
                inputVariant="outlined"
                label="Date to"
                value={filter.toDate}
                onChange={handleToDateFilterChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box mb={2}>
            <TextField
              select
              size="small"
              variant="outlined"
              label="Name"
              fullWidth
              name="name"
              onChange={handleFilterChange}
              value={filter.name}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem value={user} key={user}>
                  {user}
                </MenuItem>
              ))}
            </TextField>
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
          {!filter.credit ||
          !filter.debet ||
          filter.toDate ||
          filter.fromDate ||
          filter.name ||
          filter.amount ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetFilter}
              startIcon={<ClearAllIcon />}
            >
              Reset filter
            </Button>
          ) : null}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FiltersDrawer;
