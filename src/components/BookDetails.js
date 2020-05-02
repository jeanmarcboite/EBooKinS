import React from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "ThemeProvider";
import Tags from "components/Tags";
import style from "./Book.module.css";
import Rating from "react-rating";
import Author from "models/Author";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import renderHTML from "react-render-html";
import DB from "lib/Database";

//const logg = console.log;
const logg = () => {};

export default class BookDetails extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = { author: { image_url: "", name: "" } };
  }
  componentDidMount() {
    if (this.props.book.data.authors && this.props.book.data.authors.author) {
      this.setState({ author: this.props.book.data.authors.author });
    } else if (this.props.book.data.author) {
      let author = new Author(this.props.book.data.author);
      author
        .get(true)
        .then((author) => this.setState({ author }))
        .catch(console.warn);
    }

    if (this.props.book.data.identifier.isbn) {
      logg(this.props.book.data.identifier);
      this.props.book
        .getFromISBN(this.props.book.data.identifier.isbn)
        .then(() => this.setState({ isbn: true }));
    }

    DB.ebooks.db
      .getAttachment(this.props.book.id, "cover")
      .then((blob) => this.setState({ coverURL: URL.createObjectURL(blob) }))
      .catch(() => {});
  }
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
    if (!this.props.book.data) return "";
    let work = this.props.book.data.work;
    if (!work || !work.original_publication_year) return "";
    if (
      work.original_publication_day === 1 &&
      work.original_publication_month === 1
    )
      return work.original_publication_year;
    return `${work.original_publication_day}/${work.original_publication_month}/${work.original_publication_year}`;
  };

  getStars = () => {
    if (
      !this.props.book.data ||
      !this.props.book.data.library ||
      !this.props.book.data.library.goodreads
    )
      return null;
    let goodreads = this.props.book.data.library.goodreads;
    return (
      <>
        <Rating
          readonly
          initialRating={goodreads.average_rating}
          emptySymbol={<StarOutlined />}
          fullSymbol={<StarFilled />}
        />
        <div>{goodreads.ratings_count} ratings</div>
        <div>{goodreads.text_reviews_count} reviews</div>
      </>
    );
  };
  render = () => {
    logg(this.props.book);
    let popular_shelves = [];
    let gurl = "#";
    if (this.props.book.data) {
      if (
        this.props.book.data.library &&
        this.props.book.data.library.goodreads
      ) {
        let goodreads = this.props.book.data.library.goodreads;
        popular_shelves = goodreads.popular_shelves.shelf;
        gurl = goodreads.url;
      }
    }
    return (
      <div className={style.container}>
        <div className={style.cover}>
          <img
            src={this.state.coverURL}
            alt="cover"
            width="100%"
            onClick={this.props.onRead}
          />
          <div>{this.getOriginalPublicationDate()}</div>
        </div>
        <div className={style.subjects}>
          <Tags subject={this.props.book.data.subject}></Tags>
        </div>
        <div className={style.title}>{this.props.book.data.title}</div>
        <a className={style.links} href={gurl}>
          <img
            alt="goodreads"
            src="http://d.gr-assets.com/misc/1454549125-1454549125_goodreads_misc.png"
          />
          {this.getStars()}
        </a>
        <div className={style.author}>
          <img
            className={style.author_img}
            src={this.state.author.image_url}
            alt={this.state.author.name}
            height="80"
          />
          <h2>{this.state.author.name} </h2>
        </div>
        <div className={style.description}>
          {renderHTML(this.props.book.data.description || "")}
        </div>
        <div className={style.shelves}>
          <Tags shelves={popular_shelves}></Tags>
        </div>
      </div>
    );
  };
}

BookDetails.propTypes = {
  book: PropTypes.object.isRequired,
};
