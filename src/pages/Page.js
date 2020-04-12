import React from "react";
import { connect } from "react-redux";
import { MenuProvider, Menu, theme, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import { ThemeContext } from "ThemeProvider";

const menuID = "PageMenuID"
function Page({ menu, children, settings }) {
  const context = React.useContext(ThemeContext);
  return (
    <>
      <Menu
        id={menuID}
        theme={context.theme.type === "dark" ? theme.dark : theme.light}
        animation={animation.flip}
      >
        {menu}
      </Menu>
      <MenuProvider
        id={menuID}
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
