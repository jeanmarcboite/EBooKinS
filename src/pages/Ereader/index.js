import React from "react";
import Page from "../Page";
import RoutesMenu from "routes/Menu";

import EpubViewer from "./EpubViewer";
export default class Ereader extends React.Component {
  render() {
    let url = null;
    url = "https://gerhardsletten.github.io/react-reader/files/alice.epub";
    url = "https://s3.amazonaws.com/epubjs/books/alice.epub";
    return (
      <Page menu={<RoutesMenu />}>
        <EpubViewer url={url} />
      </Page>
    );
  }
}
