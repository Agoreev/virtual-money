import React from "react";
import {Typography, Link} from "@material-ui/core";


const Copyright:React.FC = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/Agoreev">
          Agoreev
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  export default Copyright;