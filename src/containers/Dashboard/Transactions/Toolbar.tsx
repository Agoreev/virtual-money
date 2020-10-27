import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  Hidden,
  TextField,
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Icon from "@material-ui/core/Icon";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ITransactionData } from "../../../store/transactions/actions";
import TypeSwitch from "./TypeSwitch";
import { IFilter } from "./TransactionsView";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    actions: {
      marginLeft: "auto",
    },
  })
);

interface ITransactionsToolbarProps {
  handleOpenDialog: (data?: ITransactionData | null) => void;
  refreshTransactions: () => void;
  filter: IFilter;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const TransactionsToolbar: React.FC<ITransactionsToolbarProps> = ({
  handleOpenDialog,
  refreshTransactions,
  filter,
  handleFilterChange,
}) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar className={classes.root}>
      <Typography variant="h6" id="tableTitle" component="div">
        Transactions
      </Typography>
      <Tooltip title="Refresh">
        <IconButton onClick={refreshTransactions}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Box className={classes.actions}>
        <Hidden smDown>
          <Typography variant="subtitle1">Filter</Typography>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              name="date"
              margin="normal"
              label="Date"
              value={filter.date}
              onChange={handleFilterChange}
            />
          </MuiPickersUtilsProvider>
          <TextField
            variant="outlined"
            label="Name"
            name="name"
            value={filter.name}
            onChange={handleFilterChange}
          />
          <TextField
            variant="outlined"
            label="amount"
            name="amount"
            type="number"
            value={filter.amount}
            onChange={handleFilterChange}
          />
          <TypeSwitch
            type={{ debet: filter.debet, credit: filter.credit }}
            handleChange={handleFilterChange}
            row={true}
          />
        </Hidden>
        <Button
          variant="contained"
          color="secondary"
          size="medium"
          endIcon={<Icon>send</Icon>}
          onClick={() => handleOpenDialog()}
        >
          Create
        </Button>
      </Box>
    </Toolbar>
  );
};

export default TransactionsToolbar;
