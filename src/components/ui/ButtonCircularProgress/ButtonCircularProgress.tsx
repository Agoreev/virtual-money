import React from "react";
import { CircularProgress, Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    color: theme.palette.secondary.main,
  },
}));

const ButtonCircularProgress: React.FC = () => {
  const classes = useStyles();

  return (
    <Box color="secondary.main" pl={1.5} display="flex">
      <CircularProgress
        size={24}
        thickness={5}
        className={classes.circularProgress}
      />
    </Box>
  );
};

export default ButtonCircularProgress;
