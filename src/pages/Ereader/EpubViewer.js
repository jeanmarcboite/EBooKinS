import React from "react";

import { Layout } from "antd";

import Toc from "./Toc";

import Epub from "./Epub";
import "./EpubViewer.css";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
const Arrow = styled.a`
  position: absolute;
  top: 50%;
  margin-top: -32px;
  font-size: 64px;
  font-family: arial, sans-serif;
  font-weight: bold;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-decoration: none;
  color: papayawhip;
  &:active {
    color: rgb(211, 28, 28);
  }
  &:hover {
    color: rgb(117, 15, 233);
  }
`;
const LeftArrow = styled(Arrow)`
  left: 30px;
`;
const RightArrow = styled(Arrow)`
  right: 30px;
`;

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

export default class EpubViewer extends React.PureComponent {
  static whyDidYouRender = true;
  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$toc = React.createRef();
    this.$prev = React.createRef();
    this.$next = React.createRef();

    this.eventListeners = [];
  }

  componentDidMount() {
    this.loadBook();
  }

  componentDidUpdate() {
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url });
      this.loadBook();
    }
  }

  loadBook() {
    if (this.book) {
      this.book.destroy();
    }

    this.book = new Epub({
      url: this.props.url,
      $viewer: this.$viewer,
      loadTableOfContents: (nav) => console.log(nav),
    });
  }

  render() {
    if (true)
      return (
        <Layout
          id="viewer"
          className="site-layout-background"
          style={{ padding: "24px 0" }}
        >
          <Layout.Sider className="site-layout-background" width={200}>
            <Toc toc={toc} />
          </Layout.Sider>
          <Layout.Content style={{ padding: "0 24px", minHeight: 280 }}>
            <LeftArrow id="prev" ref={this.$prev} className="arrow">
              <LeftOutlined />
            </LeftArrow>
            <div id="viewer" ref={this.$viewer} className="spreads"></div>
            <RightArrow id="next" ref={this.$next}>
              <RightOutlined />
            </RightArrow>
          </Layout.Content>
        </Layout>
      );
  }
}
