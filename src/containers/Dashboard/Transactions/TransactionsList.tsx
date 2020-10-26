import React, { Fragment } from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Divider,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { lighten } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import RepeatIcon from "@material-ui/icons/Repeat";

import { ITransaction } from "../../../store/transactions/types";
import { ITransactionData } from "../../../store/transactions/actions";
import TransactionsToolbar from "./Toolbar";

const useStyles = makeStyles((theme) => ({
  transactionsList: {
    width: "100%",
    margin: "0 auto",
    backgroundColor: theme.palette.background.paper,
  },
  divider: {
    "&:last-child": {
      display: "none",
    },
  },
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

interface ITransactionsListProps {
  transactions: ITransaction[];
  handleOpenDialog: (data?: ITransactionData | null) => void;
  loading: boolean;
  refreshTransactions: () => void;
}

const TransactionsList: React.FC<ITransactionsListProps> = ({
  transactions,
  handleOpenDialog,
  loading,
  refreshTransactions,
}) => {
  const classes = useStyles();
  const handleClick = (event: React.MouseEvent<unknown>, t: ITransaction) => {
    handleOpenDialog({ name: t.username, amount: t.amount });
  };
  const list = loading ? (
    <Box display="flex" mt={3} justifyContent="center">
      <CircularProgress />
    </Box>
  ) : (
    <List className={classes.transactionsList}>
      {transactions.map((t) => {
        return (
          <Fragment key={t.id}>
            <ListItem>
              <ListItemIcon>
                {t.amount > 0 ? (
                  <ArrowUpwardIcon className="text-green" />
                ) : (
                  <ArrowDownwardIcon className="text-red" />
                )}
              </ListItemIcon>
              <ListItemText
                secondary={
                  <Fragment>
                    {`${t.amount > 0 ? "From: " : "To: "} ${t.username}`}
                    <br />
                    {`Date: ${t.date}`}
                  </Fragment>
                }
                primary={
                  <Typography
                    variant="subtitle1"
                    className={t.amount > 0 ? "text-green" : "text-red"}
                  >
                    {t.amount} PW
                  </Typography>
                }
              />
              {t.amount < 0 ? (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={(event: React.MouseEvent<unknown>) =>
                      handleClick(event, t)
                    }
                  >
                    <RepeatIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : null}
            </ListItem>
            <Divider component="li" className={classes.divider} />
          </Fragment>
        );
      })}
    </List>
  );

  return (
    <Fragment>
      <TransactionsToolbar
        handleOpenDialog={handleOpenDialog}
        refreshTransactions={refreshTransactions}
      />
      {list}
    </Fragment>
  );
};

export default TransactionsList;
