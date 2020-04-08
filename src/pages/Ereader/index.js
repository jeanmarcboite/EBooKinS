import React from "react";
import { connect } from "react-redux";
import Page from "../Page";
import { BookTwoTone } from "@ant-design/icons";
import { loadFile } from "./store";

import RoutesMenu from "routes/Menu";
import {
  Separator,
  Item,
  MenuProvider,
  Menu,
  theme,
  animation,
  contextMenu,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

import EpubViewer from "./EpubViewer";

const menuId = "EreaderMenuID";
class Ereader extends React.Component {
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
      id: menuId,
      event: e,
    });
  };
  componentDidMount = () => {
    document.addEventListener("contextmenu", this.openContextMenu);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.openContextMenu);
  };

  render() {
    let url = null;
    url = "https://gerhardsletten.github.io/react-reader/files/alice.epub";
    url = "https://s3.amazonaws.com/epubjs/books/alice.epub";
    return (
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
          id={menuId}
          theme={this.props.settings.darkMode ? theme.dark : theme.light}
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
