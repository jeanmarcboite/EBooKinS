import React from "react";
import { connect } from "react-redux";

import { DatabaseContext } from "DatabaseProvider";

class LocationDatabase extends React.Component {
  static contextType = DatabaseContext;

  render = () => null;

  componentDidUpdate() {
    // store location in database
    this.context.locations.put({
      _id: this.props.docId,
      location: this.props.location,
    });
  }
}
function mapStateToProps(state) {
  return {
    toImport: state.ebook.toImport,
  };
}

export default connect(mapStateToProps)(LocationDatabase);

LocationDatabase.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Location",
};
