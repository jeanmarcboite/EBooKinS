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

const get = (metadata, key) => {
  let value = metadata[key] ? metadata[key][0] : "";

  if (typeof value == "string") return value;

  if ("_" in value) return value._;

  return JSON.stringify(value);
};

class BookCard extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      img: "http://placehold.it/200x240",
      description: "",
      author: {},
      subject: [],
      title: "",
    };
  }
  componentDidMount() {
    DB.ebooks.db.get(this.props.id).then(this.getMetadata);
    DB.ebooks.db
      .getAttachment(this.props.id, "cover")
      .then(this.getCover)
      .catch(() => {});
  }

  getMetadata = ({ metadata }) => {
    console.log(metadata);
    let creator = get(metadata, "dc:creator");
    let title = get(metadata, "dc:title");
    let description = get(metadata, "dc:description");
    let subject = metadata["dc:subject"] ? metadata["dc:subject"] : [];
    let ISBN = "";
    metadata["dc:identifier"].forEach((identifier) => {
      if (typeof identifier == "string") {
        if (identifier.startsWith("isbn:")) ISBN = identifier.slice(5);
      } else {
        if (identifier.$["opf:scheme"] === "ISBN")
          // TODO "AMAZON_FR"
          ISBN = identifier._;
      }
    });
    this.setState({ description, title, subject, ISBN });
    //<dc:identifier opf:scheme="ISBN">2253015547</dc:identifier>;
    if (creator.$) {
      let author = new Author(creator.$["opf:role"] === "aut" ? creator._ : "");
      author
        .get()
        .then((author) => this.setState({ author }))
        .catch(console.warn);
    }
  };

  getCover = (blob) => {
    this.setState({ img: URL.createObjectURL(blob) });
  };
  onMore = (event) => {
    if (isbn_validate.Validate(this.state.ISBN)) {
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
                alt=""
                height="80"
              />
              {this.state.subject.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
              <h2>{this.state.author.name} </h2>
              <h3>{this.state.title}</h3>
              <div>{renderHTML(this.state.description)}</div>
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
