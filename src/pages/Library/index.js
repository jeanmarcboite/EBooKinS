import React from "react";
import { connect } from "react-redux";
import Page from "pages/Page";
import RoutesMenu from "routes/Menu";
import { ThemeContext } from "ThemeProvider";

class Library extends React.Component {
  static contextType = ThemeContext;
  render() {
    return <Page menu={<RoutesMenu />}>Library</Page>;
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.settings.theme,
  };
}

export default connect(mapStateToProps)(Library);
