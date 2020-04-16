import React from "react";
import { connect } from "react-redux";
import { Menu } from "antd";

import { ThemeContext } from "ThemeProvider";
import style from "./Toc.module.css";
import "./Toc.css";

class Toc extends React.PureComponent {
  static contextType = ThemeContext;
  render() {
    return (
      <Menu
        mode="inline"
        onClick={this.props.selectChapter}
        selectedKeys={[this.props.selectedKey]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "80%" }}
        className={style.menu}
        theme={this.context.theme.name}
      >
        {this.props.toc
          ? this.props.toc.subMenus.map((item, key) => (
              <Menu.SubMenu
                className={style.subMenu}
                key={item.id}
                title={item.title}
                style={this.context.theme.submenu}
              >
                {item.items.map((subitem, subkey) => (
                  <Menu.Item
                    className="style.menuItem"
                    key={subitem.id}
                    href={subitem.href}
                  >
                    <div className={style.menuItemLabel}>{subitem.label}</div>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))
          : null}
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    ereader: state.ereader,
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Toc);

Toc.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Toc",
};
