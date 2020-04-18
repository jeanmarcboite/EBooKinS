import React from "react";
import { connect } from "react-redux";
import { BookTwoTone } from "@ant-design/icons";
import { loadFile } from "./store";
import { ThemeContext } from "ThemeProvider";
import Hotkeys from "react-hot-keys";

import RoutesMenu from "routes/Menu";
import {
  Separator,
  Item,
  Menu,
  theme,
  animation,
  contextMenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import { storeEpub } from "lib/Epub";
import EReader from "./EReader";

const menuID = "EbookMenuID";

class EbookPage extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);

    this.$input = React.createRef();
  }

  loadInput = ({ target }) => {
    if (target.files.length === 1)
      this.props.dispatch(
        loadFile,
        storeEpub(this.context.db, target.files[0])
      );
  };

  showContextMenu = (e) => {
    e.preventDefault();
    contextMenu.show({
      id: menuID,
      event: e,
    });
  };

  componentDidMount = () => {
    document.addEventListener("contextmenu", this.showContextMenu);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.showContextMenu);
  };
  onKeyDown = (keyName, e, handle) => {
    // eslint-disable-next-line default-case
    switch (keyName) {
      case "alt+i":
        return this.importEpub();
      case "alt+r":
        return this.readEpub();
    }
  };

  importEpub = () => {
    this.$input.current.click();
  };

  readEpub = () => {};

  renderInput = () => {
    return (
      <input
        id="input_file"
        ref={this.$input}
        accept="application/pdf,.epub"
        type="file"
        onChange={this.loadInput}
        style={{ display: "none" }}
      />
    );
  };

  renderMenu = () => {
    return (
      <Menu
        id={menuID}
        theme={theme[this.context.theme.type]}
        animation={animation.flip}
      >
        <Item>
          <label onClick={() => this.$input.current.click()}>
            <BookTwoTone twoToneColor="#52c41a" />
            Read book
          </label>
        </Item>
        <Separator />
        <RoutesMenu />
      </Menu>
    );
  };

  render = () => {
    return (
      <Hotkeys keyName="alt+i,alt+r" onKeyDown={this.onKeyDown}>
        {this.renderInput()}
        {this.renderMenu()}
        <EReader
          url={this.props.ebook.url}
          location={this.props.ebook.location}
          onContextMenu={this.openContextMenu}
        />
      </Hotkeys>
    );
  };
}

function mapStateToProps(state) {
  return {
    ebook: state.ebook,
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(EbookPage);
