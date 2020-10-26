import React, { Fragment } from "react";
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
} from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
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
  })
);

interface ITransactionsTableProps {
  transactions: ITransaction[];
  handleOpenDialog: (data?: ITransactionData | null) => void;
  loading: boolean;
}

const TransactionsTable: React.FC<ITransactionsTableProps> = ({
  transactions,
  handleOpenDialog,
  loading,
}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof ITransaction>("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITransaction
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: ITransaction) => {
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
    Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

  const tableContent = loading ? (
    <Box display="flex" mt={3} justifyContent="center">
      <CircularProgress />
    </Box>
  ) : (
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
          {stableSort(transactions, getComparator(order, orderBy))
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
                          color="primary"
                          onClick={(event) => handleClick(event, row)}
                        >
                          <ReplayIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TransactionsToolbar handleOpenDialog={handleOpenDialog} />
        {tableContent}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
export default TransactionsTable;
