import React from "react";
import { connect } from "react-redux";
import { BookTwoTone } from "@ant-design/icons";
import { importFile } from "./store";
import { ThemeContext } from "ThemeProvider";
import Hotkeys from "react-hot-keys";
import { loadFile } from "./store";

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
import EpubReader from "./components/EpubReader";
import DocMenu from "./components/DocMenu";
import DB from "lib/Database";

const menuID = "EbookMenuID";

class ContextMenu extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <Menu
        id={menuID}
        theme={theme[this.context.theme.type]}
        animation={animation.flip}
      >
        <Item>
          <label onClick={this.props.onImport}>
            <BookTwoTone twoToneColor="#52c41a" />
            Import Ebook
          </label>
        </Item>
        <Separator />
        <DocMenu />
        <Separator />
        <RoutesMenu />
      </Menu>
    );
  }
}

class EbookPage extends React.Component {
  constructor(props) {
    super(props);

    this.$input = React.createRef();
  }

  componentDidMount = () => {
    document.addEventListener("contextmenu", this.showContextMenu);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.showContextMenu);
  };

  importFile = ({ target }) => {
    if (target.files.length === 1) {
      this.props.dispatch(importFile(target.files[0]));
    }
  };

  loadFile(docId) {
    this.props.dispatch(loadFile(docId));
  }

  showContextMenu = (e) => {
    e.preventDefault();
    DB.ebooks.db
      .allDocs()
      .then((docs) => {
        let items = docs.rows.map((item) => (
          <Item key={item.id} onClick={() => this.loadFile(item.id)}>
            {item.id.slice(14).replace(".epub", "")}
          </Item>
        ));
        contextMenu.show({
          id: menuID,
          event: e,
          props: { items },
        });
      })
      .catch(console.error);
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
        onChange={this.importFile}
        style={{ display: "none" }}
      />
    );
  };

  render = () => {
    return (
      <Hotkeys keyName="alt+i,alt+r" onKeyDown={this.onKeyDown}>
        {this.renderInput()}
        <ContextMenu onImport={this.importEpub} />
        <EpubReader url={this.props.url} onContextMenu={this.openContextMenu} />
      </Hotkeys>
    );
  };
}

function mapStateToProps(state) {
  return {
    url: state.ebook.url,
  };
}

export default connect(mapStateToProps)(EbookPage);
