import React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import theme from "../../theme";
import Home from "../Home/Home";
import Dashboard from "../Dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <GlobalStyles />
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logout" />
            <Route render={() => <h2>Page not found</h2>} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
