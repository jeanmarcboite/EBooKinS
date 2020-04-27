import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import routes from "./routes";

export default function RoutesHeader() {
  const routeItems = routes
    .filter((route) => route.label)
    .map((item, key) => (
      <Menu.Item key={item.to} style={{ backgroundColor: "white" }}>
        <Link to={item.to} style={{ backgroundColor: "white" }}>
          {item.icon ? item.icon : null}
          {item.label}
        </Link>
      </Menu.Item>
    ));

  return (
    <Menu mode="horizontal" defaultSelectedKeys={["2"]}>
      {routeItems}
    </Menu>
  );
}
