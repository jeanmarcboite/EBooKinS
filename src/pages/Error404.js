import React from "react";
import Page from "./Page";
import RoutesMenu from "routes/ContextMenu";
export default class Settings extends React.Component {
  render() {
    return <Page menu={<RoutesMenu />}>Page not found</Page>;
  }
}
