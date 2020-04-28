import React from "react";
import { connect } from "react-redux";

import { ThemeContext } from "ThemeProvider";
import MainLayout from "pages/MainLayout";
import Book from "models/Book";
// import the react-json-view component
import ReactJson from "react-json-view";

class BookPage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      isbn: this.props.match.params.isbn,
    };
  }
  componentDidMount() {
    let book = new Book(this.props.match.params.isbn);
    book
      .get()
      .then((book) => this.setState({ book }))
      .catch(console.warn);
  }
  render = () => {
    return (
      <MainLayout>
        <ReactJson src={this.state} />
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

export default connect(mapStateToProps)(BookPage);

BookPage.whyDidYouRender = {
  logOnDifferentValues: false,
};
