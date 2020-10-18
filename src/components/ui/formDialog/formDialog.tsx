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
    alignItems: "center",
    paddingBottom: theme.spacing(3),
    maxWidth: 420,
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
  title: string;
  content: ReactNode;
  actions: ReactNode;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormDialog: React.FC<IFormDialogProps> = ({
  open,
  onClose,
  title,
  content,
  actions,
  onSubmit,
  loading,
}) => {
  const classes = useStules();
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <form noValidate onSubmit={onSubmit}>
          {content}
          <Box width="100%" className={classes.actions}>
            {actions}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
