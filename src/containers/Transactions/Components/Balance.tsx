import React from "react";
import {
  OutlinedInput,
  makeStyles,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

const useStyles = makeStyles(() => ({
  input: { padding: "0px 9px", cursor: "default" },
  outlinedInput: {
    width: 120,
    height: 40,
    cursor: "default",
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
    <Tooltip title="Balance">
      <div className={classes.wrapper}>
        <OutlinedInput
          value={balance + " PW"}
          className={classes.outlinedInput}
          classes={{ input: classes.input }}
          readOnly
          labelWidth={0}
          startAdornment={
            <InputAdornment position="start">
              <AccountBalanceWalletIcon color="secondary" />
            </InputAdornment>
          }
        />
      </div>
    </Tooltip>
  );
};

export default Balance;
