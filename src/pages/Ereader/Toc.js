import React from "react";
import { Menu } from "antd";

class Toc extends React.PureComponent {
  render() {
    return (
      <Menu
        mode="inline"
        onClick={this.props.selectChapter}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        {this.props.toc
          ? this.props.toc.subMenus.map((item, key) => (
              <Menu.SubMenu key={item.id} title={item.title}>
                {item.items.map((subitem, subkey) => (
                  <Menu.Item key={subitem.id} href={subitem.href}>
                    {subitem.label}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))
          : null}
      </Menu>
    );
  }
}

export default Toc;
