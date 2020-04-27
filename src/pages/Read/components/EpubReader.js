import React from "react";
import { connect } from "react-redux";
import { setSetting } from "pages/Settings/store";
import SplitPane from "react-split-pane";
import { ThemeContext, themes } from "ThemeProvider";

import {
  BarsOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  FrownTwoTone,
} from "@ant-design/icons";

import style from "./EpubReader.module.css";

import Toc from "./Toc";

import Epub from "lib/Epub";

import EpubView from "./EpubView";
import SelectFontSize from "components/SelectFontSize";
import SelectTheme from "components/SelectTheme";

import ComputedStyles from "components/ComputedStyles";
import DB from "lib/Database";

import { Card, Alert } from "antd";

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
      title: "chapters",
    };
  }

  componentDidMount() {
    // TODO getCurrent
    // TODO better setState to run componentDidUpdate
    this.setState({ leftPanelSize: this.props.leftPanelSize });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error) {
      if (prevProps.url === this.props.url) this.renderNoBook();
      else this.setState({ error: null });
    } else if (
      prevProps.url !== this.props.url ||
      prevProps.leftPanelSize !== this.props.leftPanelSize ||
      !this.epub
    ) {
      this.openEpub();
    } else {
      this.updateView();
    }
  }

  setError = (error) => {
    this.setState({
      error: <Alert message={error.toString()} type="error" />,
    });
  };

  openEpub = () => {
    if (this.props.url.match("^https?://")) {
      this.open(this.props.url);
    } else {
      DB.ebooks
        .get(this.props.url)
        .then(
          (data) => this.open(data),
          (error) => {
            if (error.status !== 404) this.setError(error);
            else
              this.setState({
                error: (
                  <Card
                    style={{ width: 300 }}
                    actions={[
                      <SettingOutlined key="setting" />,
                      <EditOutlined key="edit" />,
                      <EllipsisOutlined key="ellipsis" />,
                    ]}
                  >
                    <FrownTwoTone
                      twoToneColor="red"
                      style={{ fontSize: "120px" }}
                    />
                    <Card.Meta
                      description="Document not found"
                      title={this.props.url}
                    />
                  </Card>
                ),
              });
          }
        )

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
        //console.log("%c book open ", "color: green", this.props.url);
        this.epub.book.loaded.navigation.then(this.loadTableOfContents);
        this.epub.book.loaded.metadata.then(this.loadMetadata);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });

    DB.locations
      .getItem(this.props.url)
      .then(this.renderBook)
      .catch(() => this.renderBook());
  };

  loadMetadata = (metadata) => {
    // console.log("%c metadata ", "color: green", metadata);
    this.setState({ title: metadata.title });
    document.title = metadata.title;
  };

  loadTableOfContents = ({ toc }) => {
    this.setState({
      tableOfContents: {
        subMenus: [
          {
            id: "chapters",
            title: (
              <>
                <BarsOutlined />
                {this.state.title}
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
      DB.locations
        .setItem(this.props.url, location.start.cfi)
        .catch(console.error);

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
    this.updateView();
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
        <div className="style.footer">BLA</div>
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
  logOnDifferentValues: false,
  customName: "EpubReader",
};
