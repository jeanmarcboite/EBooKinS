import React from "react";
import { connect } from "react-redux";

import { DatabaseContext } from "DatabaseProvider";

class LocationDatabase extends React.Component {
    static contextType = DatabaseContext;

    render = () => null;

}
function mapStateToProps(state) {
  return {
    toImport: state.ebook.toImport,
  };
}

export default connect(mapStateToProps)(LocationDatabase);
