import React from "react";

import { Layout, Alert } from "antd";

import Toc from "./Toc";

import Epub from "./Epub";

import "./EpubViewer.css";

import {
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

import ResizablePanels from "resizable-panels-react";

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
  z-index: 49;
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

const Fullscreen = styled.div`
  position: "absolute",
  top: "20px",
  right: "20px",
  color: papayawhip;
  z-index: 99;
  &:active {
    color: rgb(211, 28, 28);
  }
  &:hover {
    color: rgb(117, 15, 233);
  }
`;

const Viewer = styled.div``;

const handleClick = (e) => console.log(e);

export default class EpubViewer extends React.PureComponent {
  static whyDidYouRender = true;
  constructor(props) {
    super(props);
    this.$viewer = React.createRef();

    this.loadTableOfContents = this.loadTableOfContents.bind(this);
    this.eventListeners = [];
    this.state = {
      // if state.url != props.url, we need to load the book
      url: this.props.url,
      tableOfContents: null,
      chapter: null,
      error: null,
    };
  }
  loadError = (error) => {
    this.setState({ error });
  };
  loadMetadata(metadata) {
    document.title = metadata.title;
  }
  loadTableOfContents({ toc }) {
    console.log(toc);
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
            items: toc.map((chapter, key) => {
              if (chapter.subitems && chapter.subitems.length > 0) {
                console.log(chapter);
              }
              return chapter;
            }),
          },
        ],
      },
    });
  }

  selectChapter = (chapter) => {
    console.log(chapter);
    this.epub.rendition.display(chapter.item.props.href);
    this.setState({ chapter });
  };
  componentDidMount() {
    this.loadBook();
  }

  componentDidUpdate() {
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url, error: null });
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
      loadMetadata: this.loadMetadata,
      onContextMenu: this.props.onContextMenu,
      onError: this.loadError,
      debug: true,
    });
  }

  prev = (e) => {
    this.epub.renditionPrev(e);
  };
  next = (e) => {
    this.epub.renditionNext(e);
  };

  setFullscreen = () => {
    document.fullscreenEnabled =
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.documentElement.webkitRequestFullScreen;

    let requestFullscreen = (element) => {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    };

    if (document.fullscreenEnabled) {
      requestFullscreen(document.documentElement);
    }
  };

  renderError = () => {
    if (!this.state.error) return null;
    return <Alert message={this.state.error.toString()} type="error" />;
  };

  /*
     Props:

        bkcolor: set a background color
        displayDirection: its like flex direction, you can choose "row" for horizontal resizing or "column" for vertical resizing
        width: set a width for you component
        height: set a height for you component
        panelsSize: a array to set your panels sizes, if you have 2 panels
        sizeUnitMeasure: unit used to calculate the amount to resize (px or %)
        resizerColor: change resizer color
        resizerSize: change resizer size
  */
  render() {
    return (
      <>
        <ResizablePanels
          bkcolor="grey"
          displayDirection="row"
          width="100%"
          height="100%"
          panelsSize={[20, 80]}
          sizeUnitMeasure="%"
          resizerColor="#353b48"
          resizerSize="5px"
        >
          <Toc
            className="toc"
            toc={this.state.tableOfContents}
            selectChapter={this.selectChapter}
          />
          <div
            ref={this.$viewer}
            className="spreads viewer"
            style={{ height: "100%", width: "100%" }}
          >
            {this.state.error ? (
              <Alert message={this.state.error.toString()} type="error" />
            ) : null}
          </div>
          <LeftArrow onClick={this.prev}>
            <LeftOutlined />
          </LeftArrow>
          <RightArrow onClick={this.next}>
            <RightOutlined />
          </RightArrow>
          <Fullscreen>
            <FullscreenOutlined onClick={this.setFullscreen} />
          </Fullscreen>
        </ResizablePanels>
      </>
    );
  }
  srender() {
    if (false && this.state.error) {
      console.log(typeof this.state.error);
      console.log("Error", JSON.stringify(this.state.error));
      return <h1>{this.state.error.toString()}</h1>;
    } else
      return (
        <Layout id="viewer-container" className="site-layout-background">
          <Layout.Sider
            className="site-layout-background"
            width={200}
            collapsible
            collapsedWidth={60}
          >
            <Toc
              toc={this.state.tableOfContents}
              selectChapter={this.selectChapter}
            />
          </Layout.Sider>
          <Layout.Content>
            <LeftArrow ref={this.$prev} onClick={this.prev}>
              <LeftOutlined />
            </LeftArrow>
            <Viewer id="viewer" ref={this.$viewer} className="spreads">
              {this.state.error ? (
                <Alert message={this.state.error.toString()} type="error" />
              ) : null}
            </Viewer>
            <RightArrow ref={this.$next} onClick={this.next}>
              <RightOutlined />
            </RightArrow>
            <Fullscreen>
              <FullscreenOutlined onClick={this.setFullscreen} />
            </Fullscreen>
          </Layout.Content>
        </Layout>
      );
  }
}
