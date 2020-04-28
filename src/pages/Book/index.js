import React from "react";
import { connect } from "react-redux";

import { ThemeContext } from "ThemeProvider";
import MainLayout from "pages/MainLayout";
import Book from "models/Book";
import renderHTML from "react-render-html";

// import the react-json-view component
import ReactJson from "react-json-view";
import style from "./Book.module.css";
import "./boxes.css";
class BookPage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      isbn: this.props.match.params.isbn,
      image_url: "",
      book: { data: { description: "" } },
    };
  }
  componentDidMount() {
    let book = new Book(this.props.match.params.isbn);
    book
      .get()
      .then((book) => {
        let image_url = book.data.image_url;
        this.setState({ book, image_url });
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
  render = () => {
    let data = this.state.book.data;
    console.log(data);
    return (
      <MainLayout>
        <div className={style.container}>
          <div className={style.cover}>
            <img src={this.state.image_url} alt="cover" width="100%" />
          </div>
          <div className={style.title}>{data.title}</div>
          <div className={style.links}>links</div>
          <div className={style.author}>author</div>
          <div className={style.description}>{this.description(true)}</div>
          <div className={style.shelves}>shelves</div>
        </div>
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
