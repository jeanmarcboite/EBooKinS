import React from "react";
import { ThemeContext } from "ThemeProvider";

import EpubReader from "./components/EpubReader";
class EReader extends React.Component {
  static contextType = ThemeContext;
  state = {
    url: null,
    data: null,
    done: false,
  };

  static getDerivedStateFromProps(props, state) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (!state.done && props.url !== state.url) {
      return {
        data: null,
        url: props.url,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.url);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data === null) {
      this._loadAsyncData(this.props.url);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.data === null) {
      return <EpubReader loading onContextMenu={this.props.onContextMenu} />;
    } else {
      return (
        <EpubReader
          url={this.state.data}
          onContextMenu={this.props.onContextMenu}
        />
      );
    }
  }
  _loadAsyncData(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      this._asyncRequest = null;
      this.setState({ data: url });
    } else {
      /*
      this._asyncRequest = db
        .getAttachment(url, "epub")
        .then((epub) => {
          this.setState({ data: epub, done: true });
        })
        .catch((err) => console.error(err));
        */
    }
  }
}

export default EReader;
