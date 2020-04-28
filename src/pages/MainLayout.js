import React, { createRef } from "react";
import { connect } from "react-redux";
import "react-contexify/dist/ReactContexify.min.css";
import style from "./Layout.module.css";
import { Layout } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookTwoTone,
} from "@ant-design/icons";
import { Menu } from "antd";

import RoutesHeader from "routes/Header";
import ImportFile from "components/ImportFile";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { collapsed: false };

    this.$input = createRef();
  }
  importEpub = () => {
    this.$input.current.click();
  };

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
        className: style.trigger,
        onClick: this.toggle,
      }
    );
  };

  render = () => {
    return (
      <Layout className={style.MainLayout}>
        <ImportFile ref={this.$input} />
        {this.sider()}
        <div className={style.container}>
          <div className={style.header} style={{ display: "flex" }}>
            {this.trigger()}
            <Menu mode="horizontal">
              <Menu.Item style={{ backgroundColor: "white" }}>
                <label onClick={this.importEpub}>
                  <BookTwoTone twoToneColor="#52c41a" />
                  Import Ebook
                </label>
              </Menu.Item>
            </Menu>
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
