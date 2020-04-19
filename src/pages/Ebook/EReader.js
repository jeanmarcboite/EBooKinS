import React from "react";

import EpubReader from "./components/EpubReader";
class EReader extends React.Component {
  state = {
    url: null,
    data: null,
  };

  static getDerivedStateFromProps(props, state) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    console.log("getDerivedStatefromProps", props.url, state.url);
    if (props.url !== state.url) {
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
    console.log("componentDidUpdate");
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
      return <div>Loading...</div>;
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
      console.log("Direct url : ", url);
      this._asyncRequest = null;
      this.setState({ data: url });
    } else {
      console.log("Try to get in database: ", url);
      this._asyncRequest = this.context.db
        .getAttachment(url, "epub")
        .then(function (epub) {
          console.log("typeof: ", typeof epub);
          url = URL.createObjectURL(epub);
          console.log(url);
          this.setState({ url });
          if (false) {
            let reader = new FileReader();
            reader.onload = () => {
              console.log("reader loaded");
              url = reader.result;
              console.log(url);
              this._asyncRequest = null;
              this.setState({ data: url });
            };
            reader.readAsArrayBuffer(epub);
          }
        })
        .catch((err) => console.error(err));
    }
  }
}

export default EReader;
