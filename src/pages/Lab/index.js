import React from "react";
import { connect } from "react-redux";
import RoutesMenu from "routes/Menu";
import {
  Separator,
  Item,
  Menu,
  theme,
  animation,
  contextMenu,
} from "react-contexify";

const menuID = "menu_id";
class Lab extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
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

        <div onContextMenu={this.openContextMenu} />
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
