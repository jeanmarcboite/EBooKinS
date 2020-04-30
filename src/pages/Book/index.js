import React from "react";
import { connect } from "react-redux";

import { ThemeContext } from "ThemeProvider";
import MainLayout from "pages/MainLayout";
import Book from "models/Book";
import renderHTML from "react-render-html";
// import the react-json-view component
import ReactJson from "react-json-view";
import { loadFile } from "pages/Read/store";
import { withRouter } from "react-router-dom";

import BookDetails from "./components/BookDetails";
class BookPage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      image_url: "",
      book: { data: { description: "" } },
      author: { img: "", name: "" },
    };
  }
  componentDidMount() {
    let ISBN = this.props.match.params.isbn;
    let book = new Book(ISBN);
    book
      .getFromISBN()
      .then((book) => {
        let image_url = book.data.image_url;
        this.setState({ book: book, image_url });
      })
      .catch(console.warn);
  }
  json = () => {
    return <ReactJson src={this.state} />;
  };
  description = (debug) => {
    if (debug) return <ReactJson src={this.state} />;
    else return renderHTML(this.state.book.data.description);
  };

  onRead = (event) => {
    this.props.dispatch(loadFile(this.state.isbn));
    this.props.history.push("/");
  };
  render = () => {
    return (
      <MainLayout>
        <BookDetails
          image_url={this.state.image_url}
          isbn={this.props.match.params.isbn}
          data={this.state.book.data}
        />
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

export default withRouter(connect(mapStateToProps)(BookPage));

BookPage.whyDidYouRender = {
  logOnDifferentValues: false,
};
