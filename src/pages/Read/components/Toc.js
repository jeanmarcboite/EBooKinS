import React from "react";
import { connect } from "react-redux";
import { Menu } from "antd";

import { ThemeContext } from "ThemeProvider";

import style from "./Toc.module.css";

class Toc extends React.PureComponent {
  static contextType = ThemeContext;

  renderItem = (item) => {
    if (!item.subitems || item.subitems.length === 0)
      return (
        <Menu.Item className="style.menuItem" key={item.id} href={item.href}>
          <div className={style.menuItemLabel}>{item.label}</div>
        </Menu.Item>
      );

    return (
      <Menu.SubMenu
        className={style.subMenu}
        key={item.id}
        href={item.href}
        title={item.label}
        style={this.context.theme.submenu}
      >
        {item.subitems.map(this.renderItem)}
      </Menu.SubMenu>
    );
  };
  render() {
    return (
      <Menu
        mode="inline"
        onClick={this.props.selectChapter}
        selectedKeys={[this.props.selectedKey]}
        defaultOpenKeys={["chapters"]}
        style={{ height: "100%" }}
        className={style.menu}
        theme={this.context.theme.name}
      >
        {this.props.toc
          ? this.props.toc.subMenus.map((item, key) => (
              <Menu.SubMenu
                mode="inline"
                className={style.subMenu}
                key={item.id}
                title={item.title}
                style={this.context.theme.submenu}
              >
                {item.items.map(this.renderItem)}
              </Menu.SubMenu>
            ))
          : null}
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    ebook: state.ebook,
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Toc);

Toc.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "Toc",
};
