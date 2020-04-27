import React from "react";
import { connect } from "react-redux";
import "react-contexify/dist/ReactContexify.min.css";
import style from "./Layout.module.css";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import RoutesHeader from "routes/Header";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: false };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render = () => {
    return (
      <Layout className={style.MainLayout}>
        <Layout.Sider
          collapsible
          collapsed={this.state.collapsed}
          collapsedWidth={0}
          className={style.sider}
        >
          {this.props.sider}
        </Layout.Sider>
        <div className={style.container}>
          {React.createElement(
            this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: this.toggle,
            }
          )}
          <RoutesHeader />
          <div className={style.content}>{this.props.children}</div>
        </div>
      </Layout>
    );
  };
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(MainLayout);

MainLayout.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Main Layout",
};
