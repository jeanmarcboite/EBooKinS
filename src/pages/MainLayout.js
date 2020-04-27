import React from "react";
import { connect } from "react-redux";
import "react-contexify/dist/ReactContexify.min.css";
import style from "./Layout.module.css";
import { Layout } from "antd";
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

  sider = () => {
    if (!this.props.sider) return null;
    return (
      <Layout.Sider
        collapsible
        collapsed={this.state.collapsed}
        collapsedWidth={0}
        trigger={null}
        className={style.sider}
      >
        {this.props.sider}
      </Layout.Sider>
    );
  };

  trigger = () => {
    if (!this.props.sider) return null;
    return React.createElement(
      this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
      {
        className: "trigger",
        onClick: this.toggle,
      }
    );
  };

  render = () => {
    return (
      <Layout className={style.MainLayout}>
        {this.sider()}
        <div className={style.container}>
          <div style={{ display: "flex" }}>
            {this.trigger()}
            <RoutesHeader />
          </div>
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
  logOnDifferentValues: false,
  customName: "Main Layout",
};
