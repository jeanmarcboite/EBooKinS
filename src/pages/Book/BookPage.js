import React from "react";
import { connect } from "react-redux";

import { ThemeContext } from "ThemeProvider";
import MainLayout from "pages/MainLayout";
import renderHTML from "react-render-html";
// import the react-json-view component
import ReactJson from "react-json-view";
import { loadFile } from "pages/Read/store";
import { withRouter } from "react-router-dom";

import BookDetails from "../../components/BookDetails";
class BookPage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {};
  }
  json = () => {
    return <ReactJson src={this.state} />;
  };

  description = (debug) => {
    if (debug) return <ReactJson src={this.state} />;
    else if (this.state.book.data)
      return renderHTML(this.state.book.data.description);
    return null;
  };

  onRead = (event) => {
    this.props.dispatch(loadFile(this.state.isbn));
    this.props.history.push("/");
  };
  render = () => {
    return (
      <MainLayout>
        <BookDetails bookID={this.props.match.params.book_id} />
      </MainLayout>
    );
  };
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.settings.theme,
  };
}

export default withRouter(connect(mapStateToProps)(BookPage));

BookPage.whyDidYouRender = {
  logOnDifferentValues: false,
};
