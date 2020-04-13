import React from "react";

import { Alert, Select } from "antd";
import { connect } from "react-redux";
import { setSetting } from "pages/Settings/store";

import { ThemeContext, themes } from "ThemeProvider";

import Toc from "./Toc";

import Epub from "./Epub";

import {
  UserOutlined,
  RightOutlined,
  LeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import style from "./Ereader.module.css";
import viewerStyle from "./EpubViewer.module.css";
import "./EpubViewer.css";
import SplitPane from "react-split-pane";

const handleClick = (e) => console.log(e);

class EpubViewer extends React.PureComponent {
  static whyDidYouRender = true;
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$container = React.createRef();
    this.$leftArrow = React.createRef();
    this.$rightArrow = React.createRef();
    this.$toc = React.createRef();
    this.$theme = React.createRef();

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
    this.epub.renditionDisplay(chapter.item.props.href);
    this.setState({ chapter });
  };
  componentDidMount() {
    this.loadBook();
    this._logSizes();
    this.updateView();
  }

  componentDidUpdate() {
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url, error: null });
      this.loadBook();
    }
    this.updateView();
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
      themes,
      debug: false,
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
        <button
          ref={this.$leftArrow}
          className={style.leftArrow}
          onClick={this.prev}
        >
          <LeftOutlined />
        </button>
        <button
          ref={this.$rightArrow}
          className={style.rightArrow}
          onClick={this.next}
        >
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
    console.log("toc width: ", getComputedStyle(this.$toc.current).width);
    console.groupEnd();
  };
  onResizeEnd = (event) => {
    this._logSizes(event);
    this.props.dispatch(
      setSetting({ setting: "leftPanelSize", value: event[0] })
    );
    this.updateView();
  };
  onResize = (event) => {
    this.updateView();
  };
  updateView = () => {
    this.epub.renditionTheme(this.context.theme.name);
    let w = getComputedStyle(this.$viewer.current).width;
    this.$leftArrow.current.style.right = `calc(${w} - 90px)`;
    this.$theme.current.style.width = getComputedStyle(this.$toc.current).width;
  };

  onResizerDragStarted = (e) => {
    console.log("onDragStarted", e);
  };

  onResizerDragFinished = (leftPanelSize) => {
    this.props.dispatch(
      setSetting({ setting: "leftPanelSize", value: leftPanelSize })
    );
  };

  onResizerChanged = (e) => {
    console.log("onResizerChanged", e);
  };
  render() {
    const viewer_style = {
      backgroundColor: this.context.theme.background,
      color: "purple",
      height: "100vh",
    };
    return (
      <div
        ref={this.$container}
        style={{
          border: "3px solid red",
        }}
      >
        <SplitPane
          split="vertical"
          defaultSize={this.props.settings.leftPanelSize}
          resizerClassName={viewerStyle.Resizer}
          onDragStarted={this.onResizerDragStarted}
          onDragFinished={this.onResizerDragFinished}
          onChange={this.onResizerChange}
        >
          <div>
            <div className={style.toc} ref={this.$toc}>
              <Toc
                toc={this.state.tableOfContents}
                selectChapter={this.selectChapter}
              />
            </div>
            <div
              ref={this.$theme}
              style={{ position: "absolute", bottom: "20px" }}
            >
              <Select
                labelInValue
                style={{ width: "100%" }}
                defaultValue={{ key: this.context.theme.name }}
                onChange={({ value }) => this.context.setTheme(value)}
              >
                {Object.keys(themes).map((theme, key) => (
                  <Select.Option key={key} value={themes[theme].name}>
                    {themes[theme].name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: "papayawhip",
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
                id="viewer"
                className={viewerStyle.viewer}
                style={viewer_style}
              >
                {this.state.error ? (
                  <Alert message={this.state.error.toString()} type="error" />
                ) : null}
              </div>
              {this.renderArrows()}
            </div>
          </div>
        </SplitPane>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(EpubViewer);
