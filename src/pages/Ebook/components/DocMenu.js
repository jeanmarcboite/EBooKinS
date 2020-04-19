import React from "react";
import { Submenu, Item } from "react-contexify";

class DocMenu extends React.Component {
  state = {
    rows: undefined,
  };

  constructor(props) {
    super(props);

    this.props.db.allDocs().then((docs) => {
      this.setState({ rows: docs.rows });
    });
  }
  items = () => {
    let rows = this.state.rows ? this.state.rows : [];

    return rows.map((item) => <Item key={item.id}>{item.id}</Item>);
  };
  render = () => {
    return <Submenu label="Load from database">{this.items()}</Submenu>;
  };
}

export default DocMenu;
