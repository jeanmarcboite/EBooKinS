import React from "react";
import { connect } from "react-redux";
import { MenuProvider, Menu, theme, animation } from "react-contexify";
function Page({ menu, children, settings }) {
  return (
    <>
      <Menu id="menu_id">{menu}</Menu>
      <MenuProvider
        id="menu_id"
        style={{
          border: "1px solid purple",
          display: "flex",
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
