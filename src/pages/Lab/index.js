import React from "react";
import { connect } from "react-redux";
import RoutesMenu from "routes/Menu";
import { Menu, theme, animation, contextMenu } from "react-contexify";

import SplitPanels from "./lab";
import PouchDB from "pouchdb";

const menuID = "menu_id";
class Lab extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    console.log("pouchdb");
    this.db = new PouchDB("http://localhost:5984/dbname");

    this.db
      .put({
        _id: "mydoc",
        title: "Heroes",
      })
      .then(function (response) {
        // handle response
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  openContextMenu = (e) => {
    e.preventDefault();
    contextMenu.show({
      id: menuID,
      event: e,
    });
  };

  render() {
    return (
      <>
        <Menu
          id={menuID}
          theme={this.props.settings.darkMode ? theme.dark : theme.light}
          animation={animation.flip}
        >
          <RoutesMenu />
        </Menu>

        <SplitPanels
          sizes={[100, 100, 100, 100]}
          onContextMenu={this.openContextMenu}
        >
          <div style={{ width: "100px" }}>
            This is the first panel. It will use the rest of the available
            space.
          </div>
          <div style={{ width: "100px" }}>
            This is the second panel. Starts with 100px.
          </div>
          <div style={{ width: "100px" }}>
            This is the third panel. Starts with 300px.
          </div>
          <div style={{ width: "100px" }}>
            This is the 4th panel. Starts with 300px.
          </div>
        </SplitPanels>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Lab);
