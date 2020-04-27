import React from "react";
import { connect } from "react-redux";
import { ThemeContext, themes } from "ThemeProvider";

import { Layout } from "antd";
import RoutesHeader from "routes/Header";

import {
  BarsOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  FrownTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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

    this.state = {
      tableOfContents: null,
      chapter: null,
      error: null,
      leftArrowVisible: true,
      rightArrowVisible: true,
      href: null,
      title: "chapters",
      collapsed: true,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount() {
    // TODO getCurrent
    // TODO better setState to run componentDidUpdate
    //this.setState({ error: null });
    this.openEpub();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error) {
      if (prevProps.url === this.props.url) this.renderNoBook();
      else this.setState({ error: null });
    } else if (prevProps.url !== this.props.url || !this.epub) {
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
        parseInt(getComputedStyle(this.$container.current).width) - 16
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

  debugCards = () => {
    if (true) return "";
    return (
      <ComputedStyles
        elems={{
          container: this.$container,
          view: this.$view,
        }}
        style_attribute="width"
        title="Elements Width"
      />
    );
  };

  sider = () => (
    <>
      <Toc
        className={style.toc}
        toc={this.state.tableOfContents}
        selectChapter={this.selectChapter}
        selectedKey={this.state.href}
      />
      <div style={{ position: "absolute", bottom: "20px", width: "100%" }}>
        {this.debugCards()}
        <SelectFontSize
          value={this.context.fontSize}
          onChange={this.setFontSize}
        />
        <SelectTheme />
      </div>
    </>
  );

  render = () => {
    return (
      <Layout className={style.MainLayout}>
        <Layout.Sider
          collapsible
          collapsed={this.state.collapsed}
          collapsedWidth={0}
          className={style.sider}
          trigger={null}
        >
          {this.sider()}
        </Layout.Sider>
        <div ref={this.$container} className={style.reader}>
          <div className={style.header} style={{ display: "flex" }}>
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: this.toggle,
              }
            )}
            <RoutesHeader />
          </div>
          <EpubView
            ref={this.$view}
            error={this.state.error}
            next={this.next}
            prev={this.prev}
            leftArrowVisible={this.state.leftArrowVisible}
            rightArrowVisible={this.state.rightArrowVisible}
          />
        </div>
      </Layout>
    );
  };
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(EpubReader);

EpubReader.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "EpubReader",
};
