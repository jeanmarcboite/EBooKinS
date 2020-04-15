import React from "react";

import { Alert, Select } from "antd";
import { connect } from "react-redux";
import { setSetting } from "pages/Settings/store";

import { ThemeContext, themes } from "ThemeProvider";

import Toc from "./components/Toc";

import Epub from "./Epub";

import ComputedStyles from "components/ComputedStyles";

import { UserOutlined } from "@ant-design/icons";

import style from "./EpubViewer.module.css";
import SplitPane from "react-split-pane";

import EpubContents from "./components/Contents";
import SelectFontSize from "components/SelectFontSize";
import SelectTheme from "components/SelectTheme";

const handleClick = (e) => console.log(e);

class EpubViewer extends React.PureComponent {
  static whyDidYouRender = {
    logOnDifferentValues: true,
    customName: "EpubViewer",
  };
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$container = React.createRef();
    this.$leftPane = React.createRef();

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
    console.log("Book metadata: ", metadata);
    document.title = metadata.title;
  }
  loadTableOfContents({ toc }) {
    console.log("load toc", toc);
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
    this.epub.display(chapter.item.props.href);
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
    this.updateView();
  }

  loadBook() {
    if (this.epub) {
      this.epub.destroy();
    }

    console.log("load book", this.$viewer);
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
    this.epub.prev();
  };
  next = (e) => {
    this.epub.next();
  };
  renderError = () => {
    if (!this.state.error) return null;
    return <Alert message={this.state.error.toString()} type="error" />;
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
    console.log("toc width: ", getComputedStyle(this.$leftPane.current).width);
    console.groupEnd();
  };

  updateView = () => {
    let sizes = {
      container: getComputedStyle(this.$container.current).width,
      leftPane: getComputedStyle(this.$leftPane.current).width,
      viewer: getComputedStyle(this.$viewer.current).width,
    };
    let width =
      (parseInt(sizes.container) - parseInt(sizes.leftPane)).toString() + "px";
    this.epub.updateRendition(
      this.context.theme.name,
      width,
      this.context.fontSize
    );
  };

  onResizerDragStarted = () => {};

  onResizerDrag = (e) => {
    console.log("onDrag", e);
  };

  onResizerDragFinished = (leftPanelSize) => {
    // this will trigger update
    this.props.dispatch(
      setSetting({ setting: "leftPanelSize", value: leftPanelSize })
    );
  };

  onKeyDown = (e) => {
    console.log("onKeyDown", e);
  };
  render() {
    return (
      <div
        ref={this.$container}
        style={{
          border: "3px solid red",
        }}
        onKeyPress={this.onKeyDown}
      >
        <SplitPane
          split="vertical"
          defaultSize={this.props.settings.leftPanelSize}
          resizerClassName={style.Resizer}
          onDragStarted={this.onResizerDragStarted}
          onDrag={this.onResizerDrag}
          onDragFinished={this.onResizerDragFinished}
        >
          <div className={style.leftPane} ref={this.$leftPane}>
            <Toc
              className={style.toc}
              toc={this.state.tableOfContents}
              selectChapter={this.selectChapter}
            />
            <div
              style={{ position: "absolute", bottom: "20px", width: "100%" }}
            >
              <ComputedStyles
                elems={{
                  container: this.$container,
                  leftPane: this.$leftPane,
                  viewer: this.$viewer,
                }}
                style_attribute="width"
                title="Elements Width"
              />
              <SelectFontSize />
              <SelectTheme />
            </div>
          </div>
          <EpubContents
            ref={this.$viewer}
            error={this.state.error}
            next={this.next}
            prev={this.prev}
          />
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
