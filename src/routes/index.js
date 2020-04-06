import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Settings from "pages/Settings";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Settings} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </Router>
  );
}
