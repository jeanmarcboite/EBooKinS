import React from "react";
import { connect } from "react-redux";

import { DatabaseContext } from "DatabaseProvider";

const put = (db, args) => {
  db.put(args).catch((err) => console.error(err));
};
const update = (db, _id, location) => {
  db.get(_id)
    .then((doc) => {
      // console.log("must remove", doc);
      db.remove(doc).then(() => put(db, { _id, location }));
    })
    .catch(() => {
      console.log("the above error is totally normal");
      put(db, { _id, location });
    });
};

const updateDocId = (db, docId) => {
  db.get("@current")
    .then((current) => {
      if (current.docId !== docId) {
        db.remove(current).then(() => db.put({ _id: "@current", docId }));
      }
    })
    .catch((err) => db.put({ _id: "@current", docId }));
};
class LocationDatabase extends React.Component {
  static contextType = DatabaseContext;

  render = () => null;

  componentDidUpdate() {
    // store location in database
    updateDocId(this.context.locations, this.props.docId);
    update(this.context.locations, this.props.docId, this.props.location);
  }
}
function mapStateToProps(state) {
  return {
    toImport: state.ebook.toImport,
  };
}

export default connect(mapStateToProps)(LocationDatabase);

LocationDatabase.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "Location",
};
