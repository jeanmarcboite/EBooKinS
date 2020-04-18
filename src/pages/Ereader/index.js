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

import EpubViewer from "./components/EpubViewer";
import { storeEpub } from "lib/Epub";

const menuID = "EreaderMenuID";
class Ereader extends React.Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  fileInput = ({ target }) => {
    if (target.files.length === 1) {
      let file = target.files[0];
      storeEpub(this.context.db, file);
      let reader = new FileReader();
      reader.onload = (e) => {
        this.props.dispatch(loadFile({ name: file.name, data: reader.result }));
        //setData(reader.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  openContextMenu = (e) => {
    e.preventDefault();
    contextMenu.show({
      id: menuID,
      event: e,
    });
  };
  componentDidMount = () => {
    document.addEventListener("contextmenu", this.openContextMenu);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.openContextMenu);
  };

  menu = () => (
    <>
      <input
        id="input_file"
        ref={this.ref}
        accept="application/pdf,.epub"
        type="file"
        onChange={this.fileInput}
        style={{ display: "none" }}
      />
      <Menu
        id={menuID}
        theme={theme[this.context.theme.type]}
        animation={animation.flip}
      >
        <Item>
          <label onClick={() => this.ref.current.click()}>
            <BookTwoTone twoToneColor="#52c41a" />
            Read book
          </label>
        </Item>
        <Separator />
        <RoutesMenu />
      </Menu>
    </>
  );

  importEpub = () => {
    this.ref.current.click();
  };

  readEpub = () => {};

  onKeyDown = (keyName, e, handle) => {
    // eslint-disable-next-line default-case
    switch (keyName) {
      case "alt+i":
        return this.importEpub();
      case "alt+r":
        return this.readEpub();
    }
  };

  render() {
    return (
      <Hotkeys keyName="alt+i,alt+r" onKeyDown={this.onKeyDown}>
        {this.menu()}

        <EpubViewer
          url={this.props.ereader.data}
          location={this.props.ereader.location}
          onContextMenu={this.openContextMenu}
        />
      </Hotkeys>
    );
  }
}

function mapStateToProps(state) {
  return {
    ereader: state.ereader,
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Ereader);
