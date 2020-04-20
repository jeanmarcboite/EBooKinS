import React from "react";
import { Submenu, Item } from "react-contexify";
import { DatabaseContext } from "DatabaseProvider";

const areEqual = (a, b) => {
  if (a === undefined) return b === undefined;
  if (b === undefined) return false;
  if (a.length !== b.length) return false;
  const sa = a.sort();
  const sb = b.sort();

  return sa.every((v, k) => {
    return v.id === sb[k].id;
  });
};
class DocMenu extends React.Component {
  static contextType = DatabaseContext;

  state = {
    rows: [],
  };

  componentDidUpdate(previousProps, previousState) {
    // DocMenu updates because the mouseEvent is in the props
    this.context.db.allDocs().then((docs) => {
      if (!areEqual(docs.rows, this.state.rows))
        this.setState({ rows: docs.rows });
    });
  }

  items = () => {
    return this.state.rows.map((item) => (
      <Item key={item.id}>{item.id.slice(14).replace(".epub", "")}</Item>
    ));
  };
  render = () => {
    return <Submenu label="Load from database">{this.items()}</Submenu>;
  };
}

DocMenu.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "DocMenu",
};
export default DocMenu;
