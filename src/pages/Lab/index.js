import React from "react";
import { connect } from "react-redux";
import RoutesMenu from "routes/Menu";
import {
  Menu as ContextMenu,
  theme,
  animation,
  contextMenu,
} from "react-contexify";

import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import style from "./Lab.module.css";

import content from "assets/hubble_bubble.jpg";

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

const menuID = "menu_id";
class Lab extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }
  openContextMenu = (e) => {
    e.preventDefault();
    contextMenu.show({
      id: menuID,
      event: e,
    });
  };

  sider = (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <SubMenu
        key="sub1"
        title={
          <span>
            <UserOutlined />
            subnav 1
          </span>
        }
      >
        <Menu.Item key="1">option1</Menu.Item>
        <Menu.Item key="2">option2</Menu.Item>
        <Menu.Item key="3">option3</Menu.Item>
        <Menu.Item key="4">option4</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        title={
          <span>
            <LaptopOutlined />
            subnav 2
          </span>
        }
      >
        <Menu.Item key="5">option5</Menu.Item>
        <Menu.Item key="6">option6</Menu.Item>
        <Menu.Item key="7">option7</Menu.Item>
        <Menu.Item key="8">option8</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub3"
        title={
          <span>
            <NotificationOutlined />
            subnav 3
          </span>
        }
      >
        <Menu.Item key="9">option9</Menu.Item>
        <Menu.Item key="10">option10</Menu.Item>
        <Menu.Item key="11">option11</Menu.Item>
        <Menu.Item key="12">option12</Menu.Item>
      </SubMenu>
    </Menu>
  );

  header = (
    <Menu mode="horizontal" defaultSelectedKeys={["2"]} className={style.menu}>
      <Menu.Item key="1">nav 1</Menu.Item>
      <Menu.Item key="2">nav 2</Menu.Item>
      <Menu.Item key="3">nav 3</Menu.Item>
    </Menu>
  );

  render = () => {
    return (
      <Layout>
        <Sider collapsible collapsedWidth={0} className={style.sider}>
          {this.sider}
        </Sider>
        <div className={style.container}>
          <div className={style.header}>{this.header}</div>
          <div className={content}>
            <img src={content} />
          </div>
          <Footer className={style.footer}>footer</Footer>
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

export default connect(mapStateToProps)(Lab);
