import React from "react";

import { ThemeContext } from "ThemeProvider";
import Tags from "components/Tags";
import style from "./Book.module.css";
import Rating from "react-rating";
import DB from "lib/Database";
import Author from "models/Author";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import renderHTML from "react-render-html";

export default class BookDetails extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      book: {},
      author: { img: "", name: "" },
    };
  }

  componentDidMount() {
    if (this.props.book_id) {
      let bookID = this.props.book_id;
      console.log(bookID);
      DB.ebooks.db
        .get(bookID)
        .then((book) => {
          this.setState({ book: book });
          if (book.author) {
            let author = new Author(book.author);
            author
              .get()
              .then((author) => this.setState({ author }))
              .catch(console.warn);
          }
        })
        .catch((error) => {
          console.error(`book ${bookID} not found in database`);
        });
    }
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
    let work = this.props.data.work;
    if (!work || !work.original_publication_year) return "";
    if (
      work.original_publication_day === 1 &&
      work.original_publication_month === 1
    )
      return work.original_publication_year;
    return `${work.original_publication_day}/${work.original_publication_month}/${work.original_publication_year}`;
  };

  render = () => {
    return (
      <div className={style.container}>
        <div className={style.cover}>
          <img
            src={this.props.image_url}
            alt="cover"
            width="100%"
            onClick={this.props.onRead}
          />
          <div>{this.getOriginalPublicationDate()}</div>
        </div>
        <div className={style.rating}>
          <Rating
            readonly
            initialRating={this.rating(this.props.data.work)}
            emptySymbol={<StarOutlined />}
            fullSymbol={<StarFilled />}
          />
          <div>{this.get(this.props.data.work, "ratings_count")} ratings</div>
          <div>{this.get(this.props.data.work, "reviews_count")} reviews</div>
        </div>
        <div className={style.title}>{this.props.data.title}</div>
        <a className={style.links} href={this.get(this.props.data, "url")}>
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
        <div className={style.description}>
          {renderHTML(
            (this.state.book.description
              ? this.state.book.description
              : this.props.data.description) || ""
          )}
        </div>
        <div className={style.shelves}>
          <Tags subject={this.state.book.subject}></Tags>
        </div>
      </div>
    );
  };
}
