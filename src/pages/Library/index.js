import React from "react";
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
import DB from "lib/Database";
import Book from "./components/Book";
import style from "./Library.module.css";

class Library extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);

    this.state = { items: [] };
  }
  componentDidMount() {
    this.getItems();
  }
  getItems = () => {
    DB.ebooks.db.allDocs().then((docs) => {
      this.setState({
        items: docs.rows.map((item) => {
          let id = item.id.slice(14).replace(".epub", "");
          let f = {
            img: "https://www.goodreads.com/en/book/show/6382055",
            author:
              "https://www.goodreads.com/author/show/346732.George_R_R_Martin",
            book: "https://www.goodreads.com/book/show/6382055",
            cover: (isbn, size) =>
              "http://covers.openlibrary.org/b/isbn/" +
              isbn +
              "-" +
              size +
              ".jpg",
          };
          return <Book id={item.id} key={item.id} />;
        }),
      });
    });
  };

  render = () => {
    return (
      <Page menu={<RoutesMenu />}>
        <div className={style.library}>{this.state.items}</div>
      </Page>
    );
  };

  renderExample() {
    const gridStyle = {
      width: "25%",
      textAlign: "center",
    };
    return (
      <Page menu={<RoutesMenu />}>
        <Card
          style={{ width: 300 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Card.Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title="With avatar"
            description="This is the description"
          />
        </Card>
        <Card title="Card Title">
          <Card.Grid style={gridStyle}>Default</Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            not hoverable
          </Card.Grid>
        </Card>
        ,
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.settings.theme,
  };
}

export default connect(mapStateToProps)(Library);
