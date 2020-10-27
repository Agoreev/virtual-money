import React, { useState, useEffect, Fragment } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Tooltip,
  IconButton,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  Divider,
  Hidden,
} from "@material-ui/core";
import RepeatIcon from "@material-ui/icons/Repeat";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { ITransaction } from "../../../store/transactions/types";
import { ITransactionData } from "../../../store/transactions/actions";
import { getComparator, stableSort, Order } from "./utils";
import TransactionsToolbar from "./Toolbar";

interface HeadCell {
  disablePadding: boolean;
  id: keyof ITransaction;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "date", numeric: false, disablePadding: true, label: "Date" },
  { id: "username", numeric: false, disablePadding: false, label: "User name" },
  { id: "amount", numeric: true, disablePadding: false, label: "Amount" },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITransaction
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof ITransaction) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell align="left">Type</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "default"}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Balance</TableCell>
        <TableCell align="right">Repeat</TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    repeatButton: {
      padding: 0,
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
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
  })
);

interface ITransactionsViewProps {
  transactions: ITransaction[];
  handleOpenDialog: (data?: ITransactionData | null) => void;
  loading: boolean;
  refreshTransactions: () => void;
}

const TransactionsView: React.FC<ITransactionsViewProps> = ({
  transactions,
  handleOpenDialog,
  loading,
  refreshTransactions,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof ITransaction>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >(transactions);
  const [filterType, setFilterType] = useState({
    credit: true,
    debet: true,
  });

  // Filter transactions on filter or transactions change
  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((t) => {
        return (
          (filterType.credit && t.amount > 0) ||
          (filterType.debet && t.amount < 0)
        );
      })
    );
  }, [filterType, transactions]);

  //Change page if there is no transactions after filter on selected page
  useEffect(() => {
    if (page * rowsPerPage > filteredTransactions.length) {
      setPage(Math.floor(filteredTransactions.length / rowsPerPage));
    }
  }, [filteredTransactions, page, rowsPerPage]);

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterType({ ...filterType, [event.target.name]: event.target.checked });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITransaction
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRepeat = (
    event: React.MouseEvent<unknown>,
    row: ITransaction
  ) => {
    handleOpenDialog({ name: row.username, amount: row.amount });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredTransactions.length - page * rowsPerPage);

  const transactionsTable = (
    <Fragment>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(filteredTransactions, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: ITransaction, index) => {
                return (
                  <TableRow hover role="button" tabIndex={-1} key={row.id}>
                    <TableCell>
                      {row.amount > 0 ? (
                        <Tooltip title="Credit">
                          <ArrowUpwardIcon className="text-green" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Debet">
                          <ArrowDownwardIcon className="text-red" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.date}
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell align="right">{row.amount} PW</TableCell>
                    <TableCell align="right">{row.balance} PW</TableCell>
                    <TableCell align="right">
                      {row.amount < 0 ? (
                        <Tooltip title="Repeat">
                          <IconButton
                            className={classes.repeatButton}
                            color="primary"
                            onClick={(event) => handleRepeat(event, row)}
                          >
                            <RepeatIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 64 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Fragment>
  );
  const transactionsList = (
    <List className={classes.transactionsList}>
      {stableSort(filteredTransactions, getComparator(order, orderBy)).map(
        (t) => {
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
                        handleRepeat(event, t)
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
        }
      )}
    </List>
  );

  const content = loading ? (
    <Box display="flex" mt={3} justifyContent="center">
      <CircularProgress />
    </Box>
  ) : (
    <Fragment>
      <Hidden smDown>{transactionsTable}</Hidden>
      <Hidden mdUp>{transactionsList}</Hidden>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TransactionsToolbar
          handleOpenDialog={handleOpenDialog}
          refreshTransactions={refreshTransactions}
          filterType={filterType}
          handleFilterTypeChange={handleFilterTypeChange}
        />
        {content}
      </Paper>
    </div>
  );
};
export default TransactionsView;
