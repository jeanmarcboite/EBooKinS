import React from "react";
import { connect } from "react-redux";
import { MenuProvider, Menu, theme, animation } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import { ThemeContext } from "ThemeProvider";

const menuID = "PageMenuID";
function Page({ id, menu, children}) {
  const context = React.useContext(ThemeContext);
  id = id ? id : menuID;
  return (
    <>
      <Menu
        id={id}
        theme={theme[context.theme.type]}
        animation={animation.flip}
      >
        {menu}
      </Menu>
      <MenuProvider
        id={id}
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
