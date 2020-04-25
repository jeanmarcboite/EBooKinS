import React from "react";
import { ThemeContext } from "ThemeProvider";
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import renderHTML from "react-render-html";
import DB from "lib/Database";
import EpubJS from "epubjs";

import style from "./Book.module.css";

export default class Book extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      img: "http://placehold.it/200x240",
      description: "",
      author: "",
    };
  }
  componentDidMount() {
    DB.ebooks.db.get(this.props.id).then(this.getMetadata);
    DB.ebooks.db
      .getAttachment(this.props.id, "cover")
      .then((blob) => this.setState({ img: URL.createObjectURL(blob) }))
      .catch(console.error);
  }

  getMetadata = ({ metadata }) => {
    console.log(metadata);
    let creator = metadata["dc:creator"][0];
    let author = creator.$["opf:role"] === "aut" ? creator._ : "";
    let description = metadata["dc:description"][0];
    this.setState({ author, description });
  };

  render = () => {
    return (
      <div
        className={style.book}
        cover={<img alt="example" src={this.state.img} />}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <img className={style.cover} src={this.state.img} alt="cover" />
        <div className={style.description}>
          <div className={style.scrolled}>
            <img
              className={style.author_img}
              src="http://placehold.it/70x70"
              alt=""
            />
            <div>Author: {this.state.author} </div>
            <div>{renderHTML(this.state.description)}</div>
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
