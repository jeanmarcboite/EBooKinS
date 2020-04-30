import React from "react";
import { ThemeContext } from "ThemeProvider";
import { Tag } from "antd";
import { EditOutlined, EllipsisOutlined, ReadFilled } from "@ant-design/icons";
import { loadFile } from "pages/Read/store";
import { withRouter } from "react-router-dom";

import Author from "models/Author";
import renderHTML from "react-render-html";
import DB from "lib/Database";

import isbn_validate from "isbn-validate";

import style from "./BookCard.module.css";

class BookCard extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      img: "http://placehold.it/200x240",
      book: { title: "", description: "", subject: [] },
      author: { img: "", name: "" },
    };
  }
  componentDidMount() {
    DB.ebooks.db.get(this.props.id).then((book) => {
      this.setState({ book });
      if (book.creator && book.creator.$) {
        let author = new Author(
          book.creator.$["opf:role"] === "aut" ? book.creator._ : ""
        );
        author
          .get()
          .then((author) => this.setState({ author }))
          .catch(console.warn);
      }
    });
    DB.ebooks.db
      .getAttachment(this.props.id, "cover")
      .then(this.getCover)
      .catch(() => {});
  }

  getCover = (blob) => {
    this.setState({ img: URL.createObjectURL(blob) });
  };
  onMore = (event) => {
    if (isbn_validate.Validate(this.state.book.ISBN)) {
      this.props.history.push("/book/" + this.state.book.ISBN);
    } else {
      this.props.history.push("/search/" + this.state.book.title);
    }
  };

  onRead = (event) => {
    this.props.dispatch(loadFile(this.props.id));
    this.props.history.push("/");
  };

  render = () => {
    return (
      <div className={style.card}>
        <div className={style.book}>
          <img
            className={style.cover}
            src={this.state.img}
            alt="cover"
            onClick={this.onRead}
          />
          <div className={style.actions}>
            <ReadFilled onClick={this.onRead} />
            <EditOutlined key="edit" />
            <EllipsisOutlined key="ellipsis" onClick={this.onMore} />
          </div>
          <div className={style.description}>
            <div className={style.scrolled}>
              <img
                className={style.author_img}
                src={this.state.author.img}
                alt={this.state.author.name}
                height="80"
              />
              {this.state.book.subject.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
              <h2>{this.state.author.name} </h2>
              <h3>{this.state.book.title}</h3>
              <div>{renderHTML(this.state.book.description)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(BookCard);

BookCard.whyDidYouRender = {
  logOnDifferentValues: false,
};
