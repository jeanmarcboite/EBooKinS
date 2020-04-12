import React from "react";
import { connect } from "react-redux";
import { BookTwoTone } from "@ant-design/icons";
import { loadFile } from "./store";
import { ThemeContext } from "ThemeProvider";

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

import EpubViewer from "./EpubViewer";

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
        theme={this.context.theme.type === "dark" ? theme.dark : theme.light}
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
  render() {
    return (
      <>
        {this.menu()}

        <EpubViewer
          url={this.props.ereader.data}
          onContextMenu={this.openContextMenu}
        />
      </>
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
