import React from "react";
import {
  OutlinedInput,
  makeStyles,
  Typography,
  Icon,
  Box,
  IconButton,
} from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

const useStyles = makeStyles(() => ({
  input: { padding: "0px 9px", cursor: "pointer" },
  outlinedInput: {
    width: 90,
    height: 40,
    cursor: "pointer",
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
}));

interface IBalanceProps {
  balance: number;
}

const Balance: React.FC<IBalanceProps> = ({ balance }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Box mr={2}>
        <AccountBalanceWalletIcon color="secondary" />
      </Box>

      <OutlinedInput
        value={balance + " PW"}
        className={classes.outlinedInput}
        classes={{ input: classes.input }}
        readOnly
        labelWidth={0}
      />
    </div>
  );
};

export default Balance;
