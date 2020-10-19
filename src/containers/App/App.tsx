import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../Home/Home";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/dashboard" />
          <Route path="/logout" />
          <Route render={() => <h2>Page not found</h2>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
