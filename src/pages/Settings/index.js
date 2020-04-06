import React from "react";
import { connect } from "react-redux";
import { setDarkMode } from "./store";
import { Form, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

class Settings extends React.Component {
  render() {
    return (
      <Form>
        <Form.Item label="Dark Mode">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={this.props.settings.darkMode}
            onChange={(checked) => this.props.dispatch(setDarkMode(checked))}
          ></Switch>
        </Form.Item>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Settings);
