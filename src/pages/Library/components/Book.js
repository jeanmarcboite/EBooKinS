import React from "react";
import { ThemeContext } from "ThemeProvider";
import { Tag } from "antd";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  ReadFilled,
} from "@ant-design/icons";

import Author from "models/Author";
import renderHTML from "react-render-html";
import DB from "lib/Database";

import style from "./Book.module.css";

export default class Book extends React.Component {
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
    // console.log(metadata);
    let creator = metadata["dc:creator"][0];
    let title = metadata["dc:title"][0];
    let description = metadata["dc:description"]
      ? metadata["dc:description"][0]
      : "no book description available";
    let subject = metadata["dc:subject"] ? metadata["dc:subject"] : [];
    this.setState({ description, title, subject });

    let author = new Author(creator.$["opf:role"] === "aut" ? creator._ : "");
    author
      .get()
      .then((author) => this.setState({ author }))
      .catch(console.warn);
  };

  getCover = (blob) => {
    this.setState({ img: URL.createObjectURL(blob) });
  };

  render = () => {
    return (
      <div className={style.card}>
        <div className={style.book}>
          <img className={style.cover} src={this.state.img} alt="cover" />
          <div className={style.actions}>
            <SettingOutlined key="setting" />
            <ReadFilled />
            <EditOutlined key="edit" />
            <EllipsisOutlined key="ellipsis" />
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

Book.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "Library.Book",
};
