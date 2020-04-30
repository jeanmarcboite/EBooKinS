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
import Author from "models/Author";
import DB from "lib/Database";
import Tags from "components/Tags";

import { StarOutlined, StarFilled } from "@ant-design/icons";
class BookPage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      isbn: this.props.match.params.isbn,
      image_url: "",
      book: { data: { description: "" } },
      db_book: {},
      author: { img: "", name: "" },
    };
  }
  componentDidMount() {
    let ISBN = this.props.match.params.isbn;
    let book = new Book(ISBN);
    DB.ebooks.db.get(ISBN).then((book) => {
      this.setState({ db_book: book });
      if (book.author) {
        let author = new Author(book.author);
        author
          .get()
          .then((author) => this.setState({ author }))
          .catch(console.warn);
      }
    });
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
    let rating = parseFloat(work.ratings_sum) / parseFloat(work.ratings_count);
    return rating;
  };
  get = (work, what) => {
    if (!work || !work[what]) return "";
    return work[what];
  };
  getOriginalPublicationDate = () => {
    let work = this.state.book.data.work;
    if (!work || !work.original_publication_year) return "";
    if (
      work.original_publication_day === 1 &&
      work.original_publication_month === 1
    )
      return work.original_publication_year;
    return `${work.original_publication_day}/${work.original_publication_month}/${work.original_publication_year}`;
  };
  render = () => {
    let data = this.state.book.data;
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
            <div>{this.getOriginalPublicationDate()}</div>
          </div>
          <div className={style.rating}>
            <Rating
              readonly
              initialRating={this.rating(data.work)}
              emptySymbol={<StarOutlined />}
              fullSymbol={<StarFilled />}
            />
            <div>{this.get(data.work, "ratings_count")} ratings</div>
            <div>{this.get(data.work, "reviews_count")} reviews</div>
          </div>
          <div className={style.title}>{data.title}</div>
          <a className={style.links} href={this.get(data, "url")}>
            <img
              alt="goodreads"
              src="http://d.gr-assets.com/misc/1454549125-1454549125_goodreads_misc.png"
            />
          </a>
          <div className={style.author}>
            <img
              className={style.author_img}
              src={this.state.author.img}
              alt={this.state.author.name}
              height="80"
            />
            <h2>{this.state.author.name} </h2>
          </div>
          <div className={style.description}>{this.description(false)}</div>
          <div className={style.shelves}>
            <Tags subject={this.state.db_book.subject}></Tags>
          </div>
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
