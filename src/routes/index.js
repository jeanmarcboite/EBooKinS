import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Error404 from "pages/Error404";

import routes from "./routes";
export default function Routes() {
  let routeItems = routes.map((item, key) => (
    <Route
      key={item.to}
      exact={item.exact ? true : false}
      path={item.to}
      component={item.component}
    />
  ));
  return (
    <Router>
      <Switch>
        {routeItems}
        <Route component={Error404} />
      </Switch>
    </Router>
  );
}
