import React from "react";
import { Submenu, Item } from "react-contexify";
class DocMenu extends React.Component {
  state = {
    rows: undefined,
  };

  constructor(props) {
    super(props);
    /*
    db.allDocs().then((docs) => {
      console.log(docs.rows);
      this.setState({ rows: docs.rows });
    });
    */
  }
  stripID = (ID) => {
    return ID.slice(14).replace(".epub", "");
  };
  items = () => {
    let rows = this.state.rows ? this.state.rows : [];

    return rows.map((item) => (
      <Item key={item.id}>{this.stripID(item.id)}</Item>
    ));
  };
  render = () => {
    return <Submenu label="Load from database">{this.items()}</Submenu>;
  };
}

export default DocMenu;
