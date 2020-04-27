import React from "react";
import { Item } from "react-contexify";
import { Link } from "react-router-dom";
import routes from "./routes";

export default function RoutesMenu() {
  let routeItems = routes
    .filter((route) => route.label)
    .map((item, key) => (
      <Item key={item.to}>
        <Link to={item.to}>
          {item.icon ? item.icon : null}
          {item.label}
        </Link>
      </Item>
    ));

  return <>{routeItems}</>;
}
