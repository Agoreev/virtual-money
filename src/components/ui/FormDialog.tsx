import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  DialogTitle,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStules = makeStyles((theme) => ({
  dialogPaper: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(3),
    width: 350,
    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
  actions: {
    marginTop: theme.spacing(2),
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

interface IFormDialogProps {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  title: string;
  content: ReactNode;
  info?: ReactNode | null;
  actions: ReactNode;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormDialog: React.FC<IFormDialogProps> = ({
  open,
  onClose,
  onExited,
  title,
  content,
  info,
  actions,
  onSubmit,
  loading,
}) => {
  const classes = useStules();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      onExited={onExited}
      aria-labelledby="form-dialog-title"
      classes={{ paper: classes.dialogPaper }}
      disableBackdropClick={loading}
      disableEscapeKeyDown={loading}
    >
      <DialogTitle
        id="form-dialog-title"
        disableTypography
        style={{ width: "100%" }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">{title}</Typography>
          <IconButton
            onClick={onClose}
            disabled={loading}
            style={{ marginRight: -12, marginTop: -10 }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <form onSubmit={onSubmit}>
          {content}
          {info}
          <Box width="100%" className={classes.actions}>
            {actions}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
