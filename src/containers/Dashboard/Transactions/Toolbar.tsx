import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ITransactionData } from "../../../store/transactions/actions";
import TypeSwitch from "./TypeSwitch";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    actions: {
      marginLeft: "auto",
    },
  })
);

interface ITransactionsToolbarProps {
  handleOpenDialog: (data?: ITransactionData | null) => void;
  refreshTransactions: () => void;
  filterType: { debet: boolean; credit: boolean };
  handleFilterTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const TransactionsToolbar: React.FC<ITransactionsToolbarProps> = ({
  handleOpenDialog,
  refreshTransactions,
  filterType,
  handleFilterTypeChange,
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
        <TypeSwitch type={filterType} handleChange={handleFilterTypeChange} />
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
