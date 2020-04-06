import React from "react";
import Page from "../Page";
import RoutesMenu from "routes/Menu";
export default class Settings extends React.Component {
  render() {
    return <Page menu={<RoutesMenu />}>Ereader</Page>;
  }
}
