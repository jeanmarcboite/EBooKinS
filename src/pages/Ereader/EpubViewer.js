import React from "react";

import { Alert } from "antd";

import { ThemeContext } from "ThemeProvider";

import Toc from "./Toc";

import Epub from "./Epub";

import {
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import ResizablePanels from "components/ResizablePanels";

import style from "./Ereader.module.css";
import viewerStyle from "./EpubViewer.module.css";

const handleClick = (e) => console.log(e);

export default class EpubViewer extends React.PureComponent {
  static whyDidYouRender = true;
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$container = React.createRef();

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
      this.setState({
        fullscreen: document.fullscreenElement !== null,
      });
    });
  }
  loadError = (error) => {
    this.setState({ error });
  };
  loadMetadata(metadata) {
    document.title = metadata.title;
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
    this._logSizes();
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

  renderArrows = () => {
    return (
      <>
        <button className={style.fullscreen}>
          {this.state.fullscreen ? (
            <FullscreenExitOutlined onClick={this.exitFullscreen} />
          ) : (
            <FullscreenOutlined onClick={this.setFullscreen} />
          )}
        </button>
        <button className={style.leftArrow} onClick={this.prev}>
          <LeftOutlined />
        </button>
        <button className={style.rightArrow} onClick={this.next}>
          <RightOutlined />
        </button>
      </>
    );
  };

  _logSizes = (data) => {
    console.groupCollapsed("Resize panels");
    console.log(data);
    console.log(this.$container.current);
    console.log(
      "container size: ",
      getComputedStyle(this.$container.current).width,
      getComputedStyle(this.$container.current).height
    );
    console.log("viewer width: ", getComputedStyle(this.$viewer.current).width);
    console.groupEnd();
  };
  onResizeEnd = (event) => {
    this._logSizes(event);
    this.epub.rendition.resize();
  };
  onResize = (event) => {
    this.epub.rendition.resize();
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
    const viewerStyle = {
      backgroundColor: this.context.theme.background,
      color: this.context.theme.text,
      height: "100vh",
    };
    return (
      <div
        ref={this.$container}
        style={{
          border: "3px solid red",
        }}
      >
        <ResizablePanels
          panelsSize={[550, 1200]}
          sizeUnitMeasure="%"
          onResize={this.onResize}
          onResizeEnd={this.onResizeEnd}
        >
          <div className={style.toc}>
            <Toc
              toc={this.state.tableOfContents}
              selectChapter={this.selectChapter}
            />
          </div>
          <div
            style={{
              display: "flex",
              background: "yellow",
              height: "100vh",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className={viewerStyle.epub_viewer}
              style={{ height: "100%", width: "100%" }}
            >
              <div
                ref={this.$viewer}
                className={viewerStyle.viewer}
                style={viewerStyle}
              >
                {this.state.error ? (
                  <Alert message={this.state.error.toString()} type="error" />
                ) : null}
              </div>
              {this.renderArrows()}
            </div>
          </div>
        </ResizablePanels>
      </div>
    );
  }
}
