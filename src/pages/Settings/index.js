import React from "react";
import { connect } from "react-redux";
import { setSetting } from "./store";
import { Form, Switch, Select } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import Page from "pages/Page";
import RoutesMenu from "routes/Menu";
import { ThemeContext } from "ThemeProvider";

class Settings extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <Page menu={<RoutesMenu />}>
        <Form>
          <Form.Item label="Theme">
            <Select
              labelInValue
              defaultValue={{ key: this.context.theme.type }}
              style={{ width: 120 }}
              onChange={({ value }) => this.context.setTheme(value)}
            >
              <Select.Option value="default">default</Select.Option>
              <Select.Option value="light">light</Select.Option>
              <Select.Option value="chocolate">Chocolate</Select.Option>
              <Select.Option value="dark">dark</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Dark Mode">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={this.props.settings.darkMode}
              onChange={(value) =>
                this.props.dispatch(setSetting({ setting: "darkMode", value }))
              }
            ></Switch>
          </Form.Item>
          <Form.Item label="Menu trigger">
            <Select
              defaultValue={this.props.settings.menuTrigger}
              style={{ width: 200 }}
              onChange={(value) =>
                this.props.dispatch(
                  setSetting({ setting: "menuTrigger", value })
                )
              }
            >
              <Select.Option value="context">Right click</Select.Option>
              <Select.Option value="double">Double Left click</Select.Option>
              <Select.Option value="disabled" disabled>
                Disabled
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
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

export default connect(mapStateToProps)(Settings);
