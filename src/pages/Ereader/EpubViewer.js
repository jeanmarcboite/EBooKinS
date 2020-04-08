import React from "react";

import { Alert } from "antd";

import Toc from "./Toc";

import Epub from "./Epub";

import "./EpubViewer.css";

import {
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import ResizablePanels from "resizable-panels-react";

import styled from "styled-components";
const Arrow = styled.a`
  position: absolute;
  top: 50%;
  margin-top: -32px;
  font-size: 48px;
  font-family: arial, sans-serif;
  font-weight: bold;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-decoration: none;
  color: red;
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

const Fullscreen = styled.a`
  position: absolute,
  top: 20px;
  right: 20px;
  font-size: 48px;
  color: red;
  z-index: 49;
  &:active {
    color: rgb(211, 28, 28);
  }
  &:hover {
    color: rgb(117, 15, 233);
  }
`;

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
      fullscreen: false,
    };
    document.addEventListener("fullscreenchange", (event) => {
      this.setState({ fullscreen: document.fullscreenElement !== null });
    });
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
  exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
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
        <div>
          <LeftArrow onClick={this.prev}>
            <LeftOutlined />
          </LeftArrow>
          <RightArrow onClick={this.next}>
            <RightOutlined />
          </RightArrow>
        </div>
        <ResizablePanels
          bkcolor="#e1b12c"
          displayDirection="row"
          width="100%"
          height="800px"
          panelsSize={[40, 60]}
          sizeUnitMeasure="%"
          resizerColor="#353b48"
          resizerSize="30px"
        >
          <div
            style={{
              background: "#44bd32",
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{ background: "#40739e", width: "80%", minWidth: "100px" }}
            >
              <Toc
                className="toc"
                toc={this.state.tableOfContents}
                selectChapter={this.selectChapter}
              />
            </div>
          </div>
          <div style={{ background: "#40739e", height: "100%", width: "100%" }}>
            <Fullscreen>
              {this.state.fullscreen ? (
                <FullscreenExitOutlined onClick={this.exitFullscreen} />
              ) : (
                <FullscreenOutlined onClick={this.setFullscreen} />
              )}
            </Fullscreen>
            <div
              ref={this.$viewer}
              className="spreads viewer"
              style={{ height: "100%", width: "100%" }}
            ></div>
          </div>
        </ResizablePanels>
      </>
    );
  }

  surrender() {
    return (
      <>
        <div>
          <Toc
            className="toc"
            toc={this.state.tableOfContents}
            selectChapter={this.selectChapter}
          />
        </div>
        <div>
          <LeftArrow onClick={this.prev}>
            <LeftOutlined />
          </LeftArrow>
          <RightArrow onClick={this.next}>
            <RightOutlined />
          </RightArrow>
          <Fullscreen>
            {this.state.fullscreen ? (
              <FullscreenExitOutlined onClick={this.exitFullscreen} />
            ) : (
              <FullscreenOutlined onClick={this.setFullscreen} />
            )}
          </Fullscreen>
        </div>
        <div ref={this.$viewer} className="spreads viewerr">
          {this.state.error ? (
            <Alert message={this.state.error.toString()} type="error" />
          ) : null}
        </div>
      </>
    );
  }
}
