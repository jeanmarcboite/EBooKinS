import React from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "ThemeProvider";
import Tags from "components/Tags";
import styleDetails from "./BookDetails.module.css";
import styleCard from "./BookCard.module.css";
import Rating from "react-rating";
import AuthorCard from "components/AuthorCard";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import renderHTML from "react-render-html";
import DB from "lib/Database";
import { Author, Book } from "models";
import {
  EditOutlined,
  EllipsisOutlined,
  ReadFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { loadFile } from "pages/Read/store";

//const logg = console.log;
//const logg = () => {};

export default class BookDetails extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = { author: { image_url: "", name: "" } };
  }

  componentDidMount() {
    this.getBook();
  }

  componentDidUpdate(prevProps) {
    if (this.props.bookID !== prevProps.bookID) this.getBook();
  }

  getBook() {
    let book = new Book(this.props.bookID);
    book
      .get()
      .then(() => {
        this.mount(book);
      })
      .catch(console.warn);
  }

  mount = (book) => {
    if (book.library?.goodreads?.authors?.author) {
      this.setState({
        author: book.library.goodreads.authors.author,
      });
    } else if (book.data?.author) {
      let author = new Author(book.data.author);
      author
        .get(true)
        .then((author) => this.setState({ author }))
        .catch(console.warn);
    }

    if (book.data?.identifier?.isbn) {
      book
        .getFromISBN(book.data.identifier.isbn)
        .then(() => this.setState({ isbn: true })); // trigger render()
    }

    DB.ebooks.db
      .getAttachment(book.id, "cover")
      .then((blob) => this.setState({ coverURL: URL.createObjectURL(blob) }))
      .catch(() => {});

    this.setState({ book });
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
    let work = this.state.book.library?.goodreads?.work;
    if (!work || !work.original_publication_year) return "";
    if (
      work.original_publication_day === 1 &&
      work.original_publication_month === 1
    )
      return work.original_publication_year;
    return `${work.original_publication_day}/${work.original_publication_month}/${work.original_publication_year}`;
  };

  getStars = () => {
    let goodreads = this.state.book.library?.goodreads;
    if (!goodreads) return null;

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
  more = () => {
    let identifier = this.state.book.data?.identifier;
    if (identifier && (identifier.isbn || identifier.goodreads)) {
      return (
        <EllipsisOutlined
          onClick={() => this.props.onMore(this.state.book)}
        ></EllipsisOutlined>
      );
    } else {
      return (
        <QuestionCircleOutlined
          onClick={() => this.props.onSearch(this.state.book)}
        ></QuestionCircleOutlined>
      );
    }
  };

  onRead = (event) => {
    this.props.dispatch(loadFile(this.state.book.id));
    this.props.history.push("/");
  };
  render = () => {
    if (!this.state.book) return null;

    if (this.props.card) return this.renderCard();
    return this.renderDetails();
  };
  renderCard = () => {
    return (
      <div className={styleCard.card}>
        <div className={styleCard.book}>
          <img
            className={styleCard.cover}
            src={this.state.coverURL}
            alt="cover"
            onClick={this.onRead}
          />
          <div className={styleCard.actions}>
            <ReadFilled onClick={this.onRead} />
            <EditOutlined key="edit" />
            {this.more()}
          </div>
          <div className={styleCard.description}>
            <div className={styleCard.scrolled}>
              <img
                className={styleCard.author_img}
                src={this.state.author.image_url}
                alt={this.state.author.name}
                height="80"
              />
              <Tags subject={this.state.book.find("subject")}></Tags>
              <h2>{this.state.author.name} </h2>
              <h3>{this.state.book.find("title")}</h3>
              <div>{renderHTML(this.state.book.find("description") || "")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderDetails = () => {
    let popular_shelves = [];
    let gurl = "#";
    let goodreads = this.state.book.library?.goodreads;
    if (goodreads) {
      popular_shelves = goodreads.popular_shelves.shelf;
      gurl = goodreads.url;
    }
    let coverURL =
      this.state.coverURL || this.state.book.library?.goodreads?.image_url;

    return (
      <div className={styleDetails.container}>
        <div className={styleDetails.cover}>
          <img
            src={coverURL}
            alt="no_cover"
            width="100%"
            onClick={this.props.onRead}
          />
          <div>{this.getOriginalPublicationDate()}</div>
        </div>
        <div className={styleDetails.subjects}>
          <Tags subject={this.state.book.find("subject")}></Tags>
        </div>
        <div className={styleDetails.title}>
          {this.state.book.find("title")}
        </div>
        <a className={styleDetails.links} href={gurl}>
          <img
            alt="goodreads"
            src="http://d.gr-assets.com/misc/1454549125-1454549125_goodreads_misc.png"
          />
          {this.getStars()}
        </a>
        <div className={styleDetails.author}>
          <AuthorCard author={this.state.author} />
        </div>
        <div className={styleDetails.description}>
          {renderHTML(this.state.book.find("description") || "")}
        </div>
        <div className={styleDetails.shelves}>
          <Tags shelves={popular_shelves}></Tags>
        </div>
      </div>
    );
  };
}

BookDetails.propTypes = {
  bookID: PropTypes.string.isRequired,
};

BookDetails.whyDidYouRender = {
  logOnDifferentValues: true,
};
