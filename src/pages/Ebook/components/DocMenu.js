import React from "react";
import { Submenu } from "react-contexify";

export const areEqual = (a, b) => {
  if (a === undefined) return b === undefined;
  if (b === undefined) return false;
  if (a.length !== b.length) return false;
  const sa = a.sort();
  const sb = b.sort();

  return sa.every((v, k) => {
    return v.id === sb[k].id;
  });
};
class DocMenu extends React.PureComponent {
  render = () => {
    return (
      <Submenu label="Load from database">
        {this.props.propsFromTrigger.items}
      </Submenu>
    );
  };
}

//export default connect(mapStateToProps)(DocMenu);
export default DocMenu;
DocMenu.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "udpate doc items",
};
