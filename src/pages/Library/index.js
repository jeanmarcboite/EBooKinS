import React from "react";
import { connect } from "react-redux";
import Page from "pages/Page";
import RoutesMenu from "routes/Menu";
import { ThemeContext } from "ThemeProvider";
import DB from "lib/Database";
import Book from "./components/Book";
import style from "./Library.module.css";
import { Separator, Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import { BookTwoTone } from "@ant-design/icons";
import ImportFile from "components/ImportFile";

class ContextMenu extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <>
        <Item>
          <label onClick={this.props.onImport}>
            <BookTwoTone twoToneColor="#52c41a" />
            Import Ebook
          </label>
        </Item>
        <Separator />
        <RoutesMenu />
      </>
    );
  }
}

class Library extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.$input = React.createRef();

    this.state = { items: [] };
  }

  importEpub = () => {
    this.$input.current.click();
  };
  componentDidMount() {
    this.getItems();
   // DB.ebooks.on("update", () => this.getItems());
  }
  getItems = () => {
    DB.ebooks.db.allDocs().then((docs) => {
      this.setState({
        items: docs.rows.map((item) => {
          let id = item.id.slice(14).replace(".epub", "");
          let f = {
            img: "https://www.goodreads.com/en/book/show/6382055",
            author:
              "https://www.goodreads.com/author/show/346732.George_R_R_Martin",
            book: "https://www.goodreads.com/book/show/6382055",
            cover: (isbn, size) =>
              "http://covers.openlibrary.org/b/isbn/" +
              isbn +
              "-" +
              size +
              ".jpg",
          };
          return <Book id={item.id} key={item.id} />;
        }),
      });
    });
  };

  render = () => {
    return (
      <>
        <ImportFile ref={this.$input} />
        <Page menu={<ContextMenu onImport={this.importEpub} />}>
          <ImportFile ref={this.$input} />
          <div className={style.library}>{this.state.items}</div>
        </Page>
      </>
    );
  };
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.settings.theme,
  };
}

export default connect(mapStateToProps)(Library);

Library.whyDidYouRender = {
  logOnDifferentValues: true,
};
