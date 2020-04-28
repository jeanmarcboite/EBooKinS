import React from "react";
import { connect } from "react-redux";
import online from "lib/online";
import MainLayout from "pages/MainLayout";
import ReactJson from "react-json-view";
import { parseString } from "xml2js";

import config, { urls } from "config";

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: this.props.match.params.query,
    };
  }
  componentDidMount() {
    online
      .get(
        urls.goodreads.search(
          this.state.query,
          localStorage.getItem("GOODREADS_KEY")
        )
      )
      .then((result) => {
        parseString(result.data, (err, parsed) => {
          console.log(parsed, result);
          let promises = parsed.GoodreadsResponse.search[0].results[0].work
            .slice(0, 1)
            .map((w) =>
              online.get(
                urls.goodreads.id(
                  w.id[0]._,
                  localStorage.getItem("GOODREADS_KEY")
                )
              )
            );

          Promise.all(promises).then((works) => this.setState({ works }));
        });
      })
      .catch(console.warn);
  }

  render = () => {
    return (
      <MainLayout>
        <ReactJson src={this.state} />
      </MainLayout>
    );
  };
}
