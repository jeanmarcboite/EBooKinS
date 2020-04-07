import React from "react";

import { Layout } from "antd";

import Toc from "./Toc";

import Epub from "./Epub";
import "./EpubViewer.css";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

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
            <div id="viewer" ref={this.$viewer} className="spreads"></div>
          </Layout.Content>
        </Layout>
      );
  }
}
