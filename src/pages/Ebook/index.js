import React from "react";
import { connect } from "react-redux";
import { BookTwoTone } from "@ant-design/icons";
import { toImport } from "./store";
import { DatabaseContext } from "DatabaseProvider";
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
  static contextType = DatabaseContext;
  constructor(props) {
    super(props);

    this.$input = React.createRef();
  }

  componentDidMount = () => {
    document.addEventListener("contextmenu", this.showContextMenu);

    if (!this.props.ebook.docId) {
      this.context.locations
        .get("@current")
        .then((doc) => {
          this.loadFile(doc.docId);
        })
        .catch(() => {
          console.log("The above error is totally normal");
        });
    }
  };

  componentDidUpdate = () => {
    if (this.props.ebook.docId && !this.props.ebook.url)
      this.loadFile(this.props.ebook.docId);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.showContextMenu);
  };

  loadInput = ({ target }) => {
    if (target.files.length === 1) {
      this.props.dispatch(toImport(target.files[0]));
    }
  };

  loadFile(docId) {
    this.context.ebooks.getAttachment(docId, "epub").then((url) =>
      this.context.locations
        .get(docId)
        .then((doc) => {
          this.props.dispatch(loadFile({ docId, url, location: doc.location }));
        })
        .catch(() => this.props.dispatch(loadFile({ docId, url })))
    );
  }

  showContextMenu = (e) => {
    e.preventDefault();
    this.context.ebooks.allDocs().then((docs) => {
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
    });
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

  render = () => {
    return (
      <Hotkeys keyName="alt+i,alt+r" onKeyDown={this.onKeyDown}>
        {this.renderInput()}
        <ContextMenu onImport={this.importEpub} />
        <EpubReader
          docId={this.props.ebook.docId}
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
  };
}

export default connect(mapStateToProps)(EbookPage);
