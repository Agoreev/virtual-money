import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import theme from "../../theme";
import Home from "../Home/Home";
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
            <Route path="/" component={Home} exact />
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
