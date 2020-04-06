import React from "react";
import { connect } from "react-redux";
import { MenuProvider, Menu, theme, animation } from "react-contexify";
function Page({ menu, children, settings }) {
  return (
    <div>
      <MenuProvider id="menu_id" component="span">
        {children}
      </MenuProvider>
      <Menu
        id="menu_id"
        theme={settings.darkMode ? theme.dark : theme.light}
        animation={animation.flip}
      >
        {menu}
      </Menu>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Page);
