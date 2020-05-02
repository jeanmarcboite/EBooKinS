import React from "react";
import { connect } from "react-redux";
import { ThemeContext } from "ThemeProvider";
import DB from "lib/Database";
import Book from "./components/BookCard";
import style from "./Library.module.css";
import MainLayout from "pages/MainLayout";
import SearchTitle from "./components/SearchTitle";
class LibraryPage extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.$input = React.createRef();

    this.state = {
      search: null,
      items: [],
    };
  }

  importEpub = () => {
    this.$input.current.click();
  };
  componentDidMount() {
    this.getItems();
    DB.ebooks.on("update", () => this.getItems());
  }

  onSearch = (book) => {
    this.setState({ search: book });
  };
  onMore = (book) => {
    this.props.history.push(`/book/${book._id}`);
  };

  getItems = () => {
    DB.ebooks.db.allDocs().then((docs) => {
      this.setState({
        items: docs.rows.map((item) => {
          return (
            <Book
              id={item.id}
              key={item.id}
              dispatch={this.props.dispatch}
              onMore={this.onMore}
              onSearch={this.onSearch}
            />
          );
        }),
      });
    });
  };

  render = () => {
    let content;
    if (this.state.search) {
      content = <SearchTitle query={this.state.search.title} />;
    } else {
      content = <div className={style.library}>{this.state.items}</div>;
    }
    return <MainLayout show_header>{content}</MainLayout>;
  };
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.settings.theme,
  };
}

export default connect(mapStateToProps)(LibraryPage);

LibraryPage.whyDidYouRender = {
  logOnDifferentValues: false,
};
