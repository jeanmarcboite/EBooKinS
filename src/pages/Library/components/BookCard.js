import React from "react";
import { ThemeContext } from "ThemeProvider";
import Tags from "components/Tags";
import {
  EditOutlined,
  EllipsisOutlined,
  ReadFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { loadFile } from "pages/Read/store";
import { withRouter } from "react-router-dom";

import Author from "models/Author";
import renderHTML from "react-render-html";
import DB from "lib/Database";

import isbn_validate from "isbn-validate";

import style from "./BookCard.module.css";

const unknown = { name: "", img: "http://placehold.it/200x240" };
class BookCard extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      img: "http://placehold.it/200x240",
      book: { title: "", description: "", subject: [] },
      author: unknown,
    };
  }
  componentDidMount() {
    DB.ebooks.db.get(this.props.id).then((book) => {
      this.setState({ book });
      if (book.author) {
        let author = new Author(book.author);
        author
          .get(false)
          .then((author) => {
            if (!author) author = unknown;
            this.setState({ author });
          })
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
  more = () => {
    if (this.state.book.identifier) {
      return <EllipsisOutlined onClick={this.onMore}></EllipsisOutlined>;
    } else {
      return (
        <QuestionCircleOutlined
          onClick={this.onSearch}
        ></QuestionCircleOutlined>
      );
    }
  };
  onMore = (event) => {
    if (this.state.book.identifier) {
      let key = Object.keys(this.state.book.identifier)[0];
      if (this.state.book.identifier.ISBN) key = "ISBN";
      this.props.history.push(
        `/book/${key}=${this.state.book.identifier[key]}`
      );
    }
  };
  onSearch = (event) => {
    this.props.history.push("/search/" + this.state.book.title);
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
            {this.more()}
          </div>
          <div className={style.description}>
            <div className={style.scrolled}>
              <img
                className={style.author_img}
                src={this.state.author.img}
                alt={this.state.author.name}
                height="80"
              />
              <Tags subject={this.state.book.subject}></Tags>
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
/*
BookCard.whyDidYouRender =  {
  logOnDifferentValues: false,
};
*/
