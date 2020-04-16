import React from "react";

import { Alert } from "antd";
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
    this.width = 0;
    this.state = {
      // if state.url != props.url, we need to load the book
      url: this.props.url,
      tableOfContents: null,
      chapter: null,
      error: null,
      fullscreen: false,
      leftArrowVisibility: "visible",
      rightArrowVisibility: "visible",
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
    console.log("%c Book metadata: ", "color: blue", metadata);
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
    this.epub.display(chapter.item.props.href);
    //this.setState({ chapter });
  };

  componentDidMount() {
    this.loadBook();
  }

  componentDidUpdate() {
    if (this.state.url !== this.props.url) {
      //this.setState({ url: this.props.url, error: null });
      this.loadBook();
    } else if (
      false &&
      this.leftPanelSize !== this.props.settings.leftPanelSize
    ) {
      this.renderBook();
    }
    this.updateView();
  }

  renderBook = () => {
    this.width =
      (
        parseInt(getComputedStyle(this.$container.current).width) -
        parseInt(getComputedStyle(this.$leftPane.current).width) -
        15
      ).toString() + "px";
    this.leftPanelSize = this.props.settings.leftPanelSize;

    this.epub.renderBook(this.width);
    this.epub.book.rendition.on("relocated", (location) => {
      console.log(location);

      if (location.atEnd) {
        this.setState({ rightArrowVisibility: "hidden" });
      } else {
        this.setState({ rightArrowVisibility: "visible" });
      }

      if (location.atStart) {
        this.setState({ leftArrowVisibility: "hidden" });
      } else {
        this.setState({ leftArrowVisibility: "visible" });
      }
    });
  };

  loadBook() {
    if (this.epub) {
      this.epub.destroy();
    }

    console.log("%c load book", "color: green", this.props.url);
    this.epub = new Epub({
      url: this.props.url,
      $viewer: this.$viewer,
      loadTableOfContents: this.loadTableOfContents,
      loadMetadata: this.loadMetadata,
      onContextMenu: this.props.onContextMenu,
      onError: this.loadError,
      themes,
    });

    this.renderBook();
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

  updateView = () => {
    console.log("%cupdateView", "color: green");
    this.epub.setTheme(this.context.theme.name);
    this.epub.book.rendition.on("rendered", () => {
      this.epub.setFontSize(this.context.fontSize);
    });
  };

  setFontSize = ({ value }) => {
    this.context.setFontSize(value);
    this.epub.setFontSize(value);
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
              <SelectFontSize
                value={this.context.fontSize}
                onChange={this.setFontSize}
              />
              <SelectTheme />
            </div>
          </div>
          <EpubContents
            ref={this.$viewer}
            error={this.state.error}
            next={this.next}
            prev={this.prev}
            leftArrowVisibility={this.state.leftArrowVisibility}
            rightArrowVisibility={this.state.rightArrowVisibility}
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
