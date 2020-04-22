import React from "react";
import { connect } from "react-redux";
import { setSetting } from "pages/Settings/store";
import SplitPane from "react-split-pane";
import { ThemeContext, themes } from "ThemeProvider";

import { UserOutlined } from "@ant-design/icons";

import style from "./EpubReader.module.css";

import Toc from "./Toc";

import Epub from "./Epub";

import EpubView from "./EpubView";
import SelectFontSize from "components/SelectFontSize";
import SelectTheme from "components/SelectTheme";

import ComputedStyles from "components/ComputedStyles";
import DB from "lib/Database";

class EpubReader extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.$view = React.createRef();
    this.$container = React.createRef();
    this.$leftPane = React.createRef();

    this.state = {
      leftPanelSize: 0,
      tableOfContents: null,
      chapter: null,
      error: null,
      leftArrowVisible: true,
      rightArrowVisible: true,
      href: null,
    };
  }

  componentDidMount() {
    // TODO getCurrent
    // TODO better setState to run componentDidUpdate
    this.setState({ leftPanelSize: this.props.leftPanelSize });
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.state, this.props, prevProps, prevState);
    if (
      prevProps.url !== this.props.url ||
      prevState.leftPanelSize !== this.props.leftPanelSize
    ) {
      this.openEpub();
    }

    this.updateView();
  }

  openEpub = () => {
    if (this.epub) {
      this.epub.destroy();
      delete this.epub;
    }

    if (this.props.url.match("^https?://")) {
      this.open(this.props.url);
    } else {
      DB.ebooks
        .get(this.props.url)
        .then((data) => this.open(data))
        .catch((error) => this.setState({ error }));
    }
  };

  open = (url) => {
    if (this.epub) {
      this.epub.destroy();
      delete this.epub;
    }
    this.epub = new Epub();
    this.epub.book
      .open(url)
      .then(() => {
        console.log("%c book open ", "color: green", this.props.url);
        this.epub.book.loaded.navigation.then(this.loadTableOfContents);
        this.epub.book.loaded.metadata.then(this.loadMetadata);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });

    this.renderBook();
  };

  loadBook() {
    if (this.epub) {
      this.epub.destroy();
      delete this.epub;
    }

    DB.ebooks
      .get(this.state.epub._id)
      .then((url) => {
        this.epub = new Epub({
          url,
          $viewer: this.$viewer,
          loadMetadata: this.loadMetadata,
          loadTableOfContents: this.loadTableOfContents,
          onContextMenu: this.props.onContextMenu,
          onError: (error) => {
            console.error(error);
            this.setState({ error });
          },
          themes,
        });

        this.renderBook();

        // TODO this.renderBook(this.props.ebook.location);
      })
      .catch(this.renderNoBook);
  }

  loadMetadata(metadata) {
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

  set(what, state) {
    if (this.state[what] !== state) this.setState({ [what]: state });
  }

  renderNoBook = () => {
    if (this.state.tableOfContents) this.setState({ tableOfContents: null });
    this.set("rightArrowVisible", false);
    this.set("leftArrowVisible", false);
    console.log("renderNoBook", this.props);
    if (this.props.docId) document.title = this.props.docId + " [no book]";
    else document.title = "EbooKinS";
  };
  renderBook = (location) => {
    this.width =
      (
        parseInt(getComputedStyle(this.$container.current).width) -
        parseInt(getComputedStyle(this.$leftPane.current).width) -
        15
      ).toString() + "px";

    this.epub.renderBook(
      this.$view.current,
      this.width,
      themes,
      location,
      this.onContextMenu
    );

    this.epub.book.rendition.on("rendered", ({ href }) => {
      this.setState({ href });
    });
    this.epub.book.rendition.on("relocated", (location) => {
      this.setState({ location: location.start.cfi });

      if (location.atEnd) {
        this.set("rightArrowVisible", false);
      } else {
        this.set("rightArrowVisible", true);
      }

      if (location.atStart) {
        this.set("leftArrowVisible", false);
      } else {
        this.set("leftArrowVisible", true);
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
    if (this.epub) {
      this.epub.setTheme(this.context.theme.name);
      this.epub.book.rendition.on("rendered", () => {
        this.epub.setFontSize(this.context.fontSize);
      });
    }
  };

  selectChapter = (chapter) => {
    if (this.epub) this.epub.display(chapter.item.props.href);
  };

  setFontSize = ({ value }) => {
    this.context.setFontSize(value);
    if (this.epub) this.epub.setFontSize(value);
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
          view: this.$view,
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
          defaultSize={this.props.leftPanelSize}
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
            ref={this.$view}
            error={this.state.error}
            next={this.next}
            prev={this.prev}
            leftArrowVisible={this.state.leftArrowVisible}
            rightArrowVisible={this.state.rightArrowVisible}
          />
        </SplitPane>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    leftPanelSize: state.settings.leftPanelSize,
  };
}

export default connect(mapStateToProps)(EpubReader);

EpubReader.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "EpubReader",
};
