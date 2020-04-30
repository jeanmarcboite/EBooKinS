import React from "react";
import { connect } from "react-redux";
import { ThemeContext } from "ThemeProvider";
import DB from "lib/Database";
import Book from "./components/BookCard";
import style from "./Library.module.css";
import MainLayout from "pages/MainLayout";

class LibraryPage extends React.Component {
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
    DB.ebooks.on("update", () => this.getItems());
  }
  getItems = () => {
    DB.ebooks.db.allDocs().then((docs) => {
      this.setState({
        items: docs.rows.map((item) => {
          return (
            <Book id={item.id} key={item.id} dispatch={this.props.dispatch} />
          );
        }),
      });
    });
  };

  render = () => {
    return (
      <MainLayout>
        <div className={style.library}>{this.state.items}</div>
      </MainLayout>
    );
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
