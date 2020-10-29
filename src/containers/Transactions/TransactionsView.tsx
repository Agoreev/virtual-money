import React, { useState, useEffect, Fragment } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Tooltip,
  IconButton,
  Button,
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
  Divider,
  Hidden,
} from "@material-ui/core";
import RepeatIcon from "@material-ui/icons/Repeat";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EventIcon from "@material-ui/icons/Event";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWalletOutlined";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { ITransaction } from "../../store/transactions/types";
import { ITransactionData } from "../../store/transactions/actions";
import { getComparator, stableSort, Order } from "./Components/utils";
import TransactionsToolbar from "./Components/Toolbar";
import FiltersDrawer, { sortingTypes } from "./Components/FiltersDrawer";

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

export interface IFilter {
  credit: boolean;
  debet: boolean;
  name?: string | null;
  amount?: string | null;
  date?: Date | null;
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
  const [filter, setFilter] = useState<IFilter>({
    credit: true,
    debet: true,
    name: "",
    amount: "",
    date: null,
  });
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(false);

  // Filter transactions on filter or transactions change
  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((t) => {
        return (
          ((filter.credit && t.amount > 0) || (filter.debet && t.amount < 0)) &&
          ((filter.name && t.username.includes(filter.name)) || !filter.name) &&
          ((filter.amount && Math.abs(t.amount) === parseInt(filter.amount)) ||
            !filter.amount) &&
          ((filter.date &&
            new Date(t.date).toDateString() === filter.date.toDateString()) ||
            !filter.date)
        );
      })
    );
  }, [filter, transactions]);

  //Change page if there is no transactions after filter on selected page
  useEffect(() => {
    if (page * rowsPerPage > filteredTransactions.length) {
      setPage(Math.floor(filteredTransactions.length / rowsPerPage));
    }
  }, [filteredTransactions, page, rowsPerPage]);

  const openFiltersDrawer = () => {
    setShowFiltersDrawer(true);
  };
  const closeFiltersDrawer = () => {
    setShowFiltersDrawer(false);
  };

  const handleResetFilter = () => {
    setFilter({
      ...filter,
      credit: true,
      debet: true,
      name: "",
      amount: "",
      date: null,
    });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "checkbox") {
      setFilter({ ...filter, [event.target.name]: event.target.checked });
    } else {
      setFilter({ ...filter, [event.target.name]: event.target.value });
    }
  };

  const handleDateFilterChange = (date: Date | null) => {
    setFilter({ ...filter, date });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITransaction
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //Handle sorting in mobile drawer
  const handleSortChange = (event: React.ChangeEvent<any>) => {
    switch (event.target.value) {
      case sortingTypes.dateDescending:
        setOrder("desc");
        setOrderBy("date");
        break;
      case sortingTypes.dateAscending:
        setOrder("asc");
        setOrderBy("date");
        break;
      case sortingTypes.nameDescending:
        setOrder("desc");
        setOrderBy("username");
        break;
      case sortingTypes.nameAscending:
        setOrder("asc");
        setOrderBy("username");
        break;
      case sortingTypes.amountDescending:
        setOrder("desc");
        setOrderBy("amount");
        break;
      case sortingTypes.amountAscending:
        setOrder("asc");
        setOrderBy("amount");
        break;
      default:
        setOrder("desc");
        setOrderBy("date");
        break;
    }
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

  //Get unique users from all transactions
  const users = [...new Set(transactions.map((t) => t.username))];

  const transactionsList = (
    <Fragment>
      <FiltersDrawer
        filter={filter}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        open={showFiltersDrawer}
        users={users}
        onClose={closeFiltersDrawer}
        handleDateFilterChange={handleDateFilterChange}
        handleResetFilter={handleResetFilter}
      />
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
                    primary={
                      <Typography
                        variant="subtitle1"
                        className={t.amount > 0 ? "text-green" : "text-red"}
                      >
                        {t.amount} PW
                      </Typography>
                    }
                    secondary={
                      <Fragment>
                        <Box
                          display="flex"
                          alignItems="center"
                          mb={1}
                          component="span"
                        >
                          <AccountCircleIcon color="inherit" fontSize="small" />
                          {t.username}
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          component="span"
                          mb={1}
                        >
                          <EventIcon color="inherit" fontSize="small" />
                          {t.date}
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          component="span"
                        >
                          <AccountBalanceWalletOutlinedIcon
                            color="inherit"
                            fontSize="small"
                          />
                          {t.balance} PW
                        </Box>

                        {t.amount < 0 ? (
                          <Box
                            textAlign="right"
                            component="span"
                            display="block"
                          >
                            <Button
                              color="primary"
                              onClick={(event: React.MouseEvent<unknown>) =>
                                handleRepeat(event, t)
                              }
                            >
                              Repeat
                            </Button>
                          </Box>
                        ) : null}
                      </Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" className={classes.divider} />
              </Fragment>
            );
          }
        )}
      </List>
    </Fragment>
  );

  const content = loading ? (
    <Box display="flex" mt={3} justifyContent="center">
      <CircularProgress />
    </Box>
  ) : transactions.length > 0 ? (
    <Fragment>
      <Hidden smDown>{transactionsTable}</Hidden>
      <Hidden mdUp>{transactionsList}</Hidden>
    </Fragment>
  ) : (
    <Box textAlign="center" p={3}>
      <Typography variant="subtitle1">There is no transactions yet.</Typography>
    </Box>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TransactionsToolbar
          handleOpenDialog={handleOpenDialog}
          refreshTransactions={refreshTransactions}
          filter={filter}
          users={users}
          handleFilterChange={handleFilterChange}
          handleDateFilterChange={handleDateFilterChange}
          handleResetFilter={handleResetFilter}
        />
        <Hidden mdUp>
          <Button
            variant="outlined"
            color="secondary"
            onClick={openFiltersDrawer}
            startIcon={<FilterListIcon />}
          >
            Filters and sorting
          </Button>
        </Hidden>
        {content}
      </Paper>
    </div>
  );
};
export default TransactionsView;
