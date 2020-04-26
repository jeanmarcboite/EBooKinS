import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { BookTwoTone } from "@ant-design/icons";
import { ThemeContext } from "ThemeProvider";
import Hotkeys from "react-hot-keys";
import { loadFile } from "./store";
import { withRouter } from "react-router-dom";

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
import ImportFile from "components/ImportFile";

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

class ReadPage extends React.Component {
  constructor(props) {
    super(props);
    this.$input = React.createRef();

    if (props.match.params.id) {
      this.props.dispatch(loadFile(props.match.params.id));
    }

    this.state = { redirect: null };
  }

  componentDidMount = () => {
    document.addEventListener("contextmenu", this.showContextMenu);
    console.log(this.props.match.params);
  };

  componentWillUnmount = () => {
    document.removeEventListener("contextmenu", this.showContextMenu);
    console.log(this.props.match.params);
  };

  importFile = ({ target }) => {
    if (target.files.length === 1) {
      let epub = target.files[0];
      DB.ebooks
        .put(epub)
        .then((result) => {
          this.loadFile(result.id);
        })
        .catch((err) => console.error(err));
    }
  };

  loadFile = (docId) => {
    this.props.dispatch(loadFile(docId));

    this.props.history.push("/");
    //this.setState({ redirect: "/read/" + docId });
  };

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
    if (this.state.redirect) {
      //this.setState({ redirect: null });
      console.log("redirect");
      return <Redirect to={this.state.redirect} />;
    }
    console.log("read book");
    return (
      <Hotkeys keyName="alt+i,alt+r" onKeyDown={this.onKeyDown}>
        <ImportFile ref={this.$input} loadFile={this.loadFile} />
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

// before
//export default connect(mapStateToProps)(ReadPage)

// after
export default withRouter(connect(mapStateToProps)(ReadPage));

ReadPage.whyDidYouRender = {
  logOnDifferentValues: true,
};
