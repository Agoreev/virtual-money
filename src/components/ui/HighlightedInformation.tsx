import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.warning.light,
    border: `2px solid ${theme.palette.warning.main}`,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}));

const HighlitedInformation: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Typography variant="body2">{children}</Typography>
    </div>
  );
};

export default HighlitedInformation;
