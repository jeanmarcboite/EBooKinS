import React from "react";
import { connect } from "react-redux";
import { MenuProvider, Menu, theme, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

function Page({ menu, children, settings }) {
  return (
    <>
      <Menu
        id="menu_id"
        theme={settings.darkMode ? theme.dark : theme.light}
        animation={animation.flip}
      >
        {menu}
      </Menu>
      <MenuProvider
        id="menu_id"
        style={{
          border: "1px solid purple",
          height: "100vh",
        }}
      >
        {children}
      </MenuProvider>
    </>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Page);
