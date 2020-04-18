import React from "react";
import { connect } from "react-redux";
import { setSetting } from "pages/Settings/store";
import SplitPane from "react-split-pane";
import { ThemeContext, themes } from "ThemeProvider";

import { UserOutlined } from "@ant-design/icons";

import style from "./EpubReader.module.css";

import Toc from "./Toc";

import Epub from "../Epub";

import EpubView from "./EpubView";
import SelectFontSize from "components/SelectFontSize";
import SelectTheme from "components/SelectTheme";

import ComputedStyles from "components/ComputedStyles";

class EpubReader extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.$viewer = React.createRef();
    this.$container = React.createRef();
    this.$leftPane = React.createRef();

    this.state = {
      // if state.url != props.url, we need to load the book
      url: this.props.url,
      tableOfContents: null,
      chapter: null,
      error: null,
      leftArrowVisibility: "visible",
      rightArrowVisibility: "visible",
      href: null,
    };
  }

  componentDidMount() {
    this.loadBook();
  }

  componentDidUpdate() {
    if (this.state.url !== this.props.url) {
      this.setState({ url: this.props.url, error: null });
    }

    if (
      this.state.url !== this.props.url ||
      this.leftPanelSize !== this.props.settings.leftPanelSize
    ) {
      this.loadBook();
    }

    this.updateView();
  }
  loadBook() {
    if (this.epub) {
      this.epub.destroy();
    }

    console.log("%c load book", "color: green", this.props.url);
    this.epub = new Epub({
      url: this.props.url,
      $viewer: this.$viewer,
      loadMetadata: this.loadMetadata,
      loadTableOfContents: this.loadTableOfContents,
      onContextMenu: this.props.onContextMenu,
      onError: (error) => {
        this.setState({ error });
      },
      themes,
    });

    this.renderBook();
    let cfi = localStorage.getItem("cfi");

    if (cfi) this.epub.display(cfi);
  }

  loadMetadata(metadata) {
    console.log("%c Reading epub: ", "color: blue", metadata);
    document.title = metadata.title;
  }

  loadTableOfContents = ({ toc }) => {
    this.setState({
      tableOfContents: {
        subMenus: [
          {
            id: "chapters",
            title: (
              <>
                <UserOutlined />
                chapters
              </>
            ),
            items: toc,
          },
        ],
      },
    });
  };

  renderBook = () => {
    this.width =
      (
        parseInt(getComputedStyle(this.$container.current).width) -
        parseInt(getComputedStyle(this.$leftPane.current).width) -
        15
      ).toString() + "px";
    this.leftPanelSize = this.props.settings.leftPanelSize;

    this.epub.renderBook(this.width);

    this.epub.book.rendition.on("rendered", ({ href }) => {
      this.setState({ href });
    });
    this.epub.book.rendition.on("relocated", (location) => {
      localStorage.setItem("cfi", location.start.cfi);

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
  prev = (e) => {
    this.epub.prev();
  };
  next = (e) => {
    this.epub.next();
  };

  updateView = () => {
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
  debugCards = () => {
    if (true) return "";
    return (
      <ComputedStyles
        elems={{
          container: this.$container,
          leftPane: this.$leftPane,
          viewer: this.$viewer,
        }}
        style_attribute="width"
        title="Elements Width"
      />
    );
  };
  render = () => {
    return (
      <div ref={this.$container} className={style.reader}>
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
              selectedKey={this.state.href}
            />
            <div
              style={{ position: "absolute", bottom: "20px", width: "100%" }}
            >
              {this.debugCards()}
              <SelectFontSize
                value={this.context.fontSize}
                onChange={this.setFontSize}
              />
              <SelectTheme />
            </div>
          </div>
          <EpubView
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
  };
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(EpubReader);

EpubReader.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Epub Reader",
};
