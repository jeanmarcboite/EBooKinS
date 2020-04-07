import React from "react";

import { Layout } from "antd";

import Toc from "./Toc";

import Epub from "./Epub";
import "./examples.css";
import { UserOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";

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
  z-index: 99;
  &:active {
    color: rgb(211, 28, 28);
  }
  &:hover {
    color: rgb(117, 15, 233);
  }
`;
const LeftArrow = styled(Arrow)`
  left: 230px;
`;
const RightArrow = styled(Arrow)`
  right: 30px;
`;

const Viewer = styled.div``;

const handleClick = (e) => console.log(e);

export default class EpubViewer extends React.PureComponent {
  static whyDidYouRender = true;
  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$toc = React.createRef();
    this.$prev = React.createRef();
    this.$next = React.createRef();

    this.loadTableOfContents = this.loadTableOfContents.bind(this);
    this.eventListeners = [];
    // we will have a problem with this later
    this.state = { url: this.props.url, tableOfContents: null, chapter: null };
  }
  loadTableOfContents({ toc }) {
    this.setState({
      tableOfContents: {
        onClick: handleClick,
        subMenus: [
          {
            id: "sub1",
            title: (
              <>
                <UserOutlined />
                chapters
              </>
            ),
            items: toc.map((item, key) => {
              return {
                id: item.id,
                href: item.href,
                label: item.label,
              };
            }),
          },
        ],
      },
    });
  }

  selectChapter = (chapter) => {
    console.log(chapter);
    this.epub.rendition.display(chapter.key);
    this.setState({ chapter });
  };
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
    if (this.epub) {
      this.epub.destroy();
    }

    this.epub = new Epub({
      url: this.props.url,
      $viewer: this.$viewer,
      loadTableOfContents: this.loadTableOfContents,
    });
  }

  prev = (e) => {
    this.epub.renditionPrev(e);
  };
  next = (e) => {
    this.epub.renditionNext(e);
  };

  render() {
    if (true)
      return (
        <Layout
          id="viewer-container"
          className="site-layout-background"
          style={{ padding: "24px 0" }}
        >
          <Layout.Sider className="site-layout-background" width={200}>
            <Toc
              toc={this.state.tableOfContents}
              selectChapter={this.selectChapter}
            />
          </Layout.Sider>
          <Layout.Content style={{ padding: "0 0", minHeight: 280 }}>
            <LeftArrow ref={this.$prev} onClick={this.prev}>
              <LeftOutlined />
            </LeftArrow>
            <Viewer id="viewer" ref={this.$viewer} className="spreads"></Viewer>
            <RightArrow ref={this.$next} onClick={this.next}>
              <RightOutlined />
            </RightArrow>
          </Layout.Content>
        </Layout>
      );
  }
}
