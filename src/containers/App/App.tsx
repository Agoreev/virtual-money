import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import theme from "../../theme";
import Auth from "../Auth/Auth";
import Transactions from "../Transactions/Transactions";
import Logout from "../Logout/Logout";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <GlobalStyles />
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/" component={Auth} exact />
            <Route path="/register" component={Auth} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/logout" component={Logout} />
            <Route render={() => <h2>Page not found</h2>} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
