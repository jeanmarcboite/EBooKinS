import React from "react";
import { connect } from "react-redux";

import { ThemeContext } from "ThemeProvider";
import MainLayout from "pages/MainLayout";
import Book from "models/Book";
import renderHTML from "react-render-html";
import Rating from "react-rating";
// import the react-json-view component
import ReactJson from "react-json-view";
import style from "./Book.module.css";
import { loadFile } from "pages/Read/store";
import { withRouter } from "react-router-dom";

import { StarOutlined, StarFilled } from "@ant-design/icons";
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
      .getFromISBN()
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

  onRead = (event) => {
    this.props.dispatch(loadFile(this.state.isbn));
    this.props.history.push("/");
  };

  rating = (work) => {
    if (!work) return 0;
    let rating =
      parseFloat(work.ratings_sum[0]._) / parseFloat(work.ratings_count[0]._);
    return rating;
  };
  render = () => {
    let data = this.state.book.data;
    console.log(data);
    return (
      <MainLayout>
        <div className={style.container}>
          <div className={style.cover}>
            <img
              src={this.state.image_url}
              alt="cover"
              width="100%"
              onClick={this.onRead}
            />
          </div>
          <div className={style.rating}>
            <Rating
              readonly
              initialRating={this.rating(data.work)}
              emptySymbol={<StarOutlined />}
              fullSymbol={<StarFilled />}
            />
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

export default withRouter(connect(mapStateToProps)(BookPage));

BookPage.whyDidYouRender = {
  logOnDifferentValues: false,
};
