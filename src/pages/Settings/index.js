import React from "react";
import { connect } from "react-redux";
import { setDarkMode } from "./store";
import { Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

class Settings extends React.Component {
  render() {
    return (
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        defaultChecked
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Settings);
