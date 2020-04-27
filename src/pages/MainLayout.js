import React from "react";
import { connect } from "react-redux";
import "react-contexify/dist/ReactContexify.min.css";
import { ThemeContext } from "ThemeProvider";
import style from "./Layout.module.css";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

import routes from "routes/routes";

const menuID = "PageMenuID";
function MainLayout({ id, sider, children }) {
  const context = React.useContext(ThemeContext);
  id = id ? id : menuID;

  const routeItems = routes
    .filter((route) => route.label)
    .map((item, key) => (
      <Menu.Item key={item.to}>
        <Link to={item.to}>
          {item.icon ? item.icon : null}
          {item.label}
        </Link>
      </Menu.Item>
    ));

  const header = (
    <Menu mode="horizontal" defaultSelectedKeys={["2"]} className={style.menu}>
      {routeItems}
    </Menu>
  );
  return (
    <Layout className={style.MainLayout}>
      <Layout.Sider collapsible collapsedWidth={0} className={style.sider}>
        {sider}
      </Layout.Sider>
      <div className={style.container}>
        <div className={style.header}>{header}</div>
        <div className={style.content}>{children}</div>
      </div>
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(MainLayout);
