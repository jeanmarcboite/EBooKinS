import React, { createRef } from "react";
import { connect } from "react-redux";
import Page from "pages/Page";
import RoutesMenu from "routes/Menu";
import { ThemeContext } from "ThemeProvider";
import { Card, Avatar } from "antd";
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
      metadata: { description: "" },
    };
    this.$cover = createRef();
  }
  componentDidMount() {
    DB.ebooks.db
      .getAttachment(this.props.id, "epub")
      .then(this.readEpub)
      .catch(console.error);
    DB.ebooks.db
      .getAttachment(this.props.id, "cover")
      .then(this.addimg)
      .catch(console.error);
  }
  addimg = (blob) => {
    console.log("blob", blob.size);
    var url = URL.createObjectURL(blob);
    this.$cover.current.src = url;
    return;
    var img = document.createElement("img");
    img.src = url;
    document.body.appendChild(img);
  };

  readEpub = (epub) => {
    let book = EpubJS();
    book.open(epub).then(() => {
      book.loaded.metadata.then((metadata) => {
        console.log(metadata);
        this.setState({ metadata });
      });
    });
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
        <img
          className={style.cover}
          ref={this.$cover}
          src={this.state.img}
          alt="cover"
        />
        <div className={style.description}>
          <div className={style.scrolled}>
            <img
              className={style.author_img}
              src="http://placehold.it/70x70"
              alt=""
            />
            <div>{renderHTML(this.state.metadata.description)}</div>
          </div>
        </div>
      </div>
    );
  };
}

Book.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Library.Book",
};
