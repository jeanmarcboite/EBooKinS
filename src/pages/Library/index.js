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

class Library extends React.Component {
  static contextType = ThemeContext;

  render() {
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
