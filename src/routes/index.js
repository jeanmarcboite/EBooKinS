import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Settings from "pages/Settings";
import Error404 from "pages/Error404";
export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Settings} />
        <Route path="/settings" component={Settings} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
}
