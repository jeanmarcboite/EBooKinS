import React from "react";
import Page from "../Page";
import RoutesMenu from "routes/Menu";

import { Layout } from "antd";

import Sider from "./Sider";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

const handleClick = (e) => console.log(e);

const toc = {
  onClick: handleClick,
  subMenus: [
    {
      id: "sub1",
      title: (
        <>
          <UserOutlined />
          subnav 1
        </>
      ),
      items: [
        {
          id: "1",
          content: "option1",
        },
        {
          id: "2",
          content: "option2",
        },
      ],
    },
    {
      id: "sub2",
      title: (
        <>
          <LaptopOutlined />
          subnav 2
        </>
      ),
      items: [
        {
          id: "5",
          content: "option5",
        },
        {
          id: "6",
          content: "option6",
        },
      ],
    },
    {
      id: "sub3",
      title: (
        <>
          <NotificationOutlined />
          subnav 3
        </>
      ),
      items: [
        {
          id: "31",
          content: "option1",
        },
        {
          id: "32",
          content: "option2",
        },
      ],
    },
  ],
};

export default class Settings extends React.Component {
  render() {
    return (
      <Page menu={<RoutesMenu />}>
        <Layout
          className="site-layout-background"
          style={{ padding: "24px 0" }}
        >
          <Sider toc={toc} />
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            Content
          </Content>
        </Layout>
      </Page>
    );
  }
}
