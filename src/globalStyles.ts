import { withStyles } from "@material-ui/core";

const styles = () => ({
  "@global": {
    "*:focus": {
      outline: 0,
    },
    ".selectedNavLink": {
      "background-color": "rgba(0, 0, 0, 0.08)",
      display: "block",
    },
    ".text-white": {
      color: "white",
    },
  },
});

function globalStyles() {
  return null;
}

export default withStyles(styles)(globalStyles);
