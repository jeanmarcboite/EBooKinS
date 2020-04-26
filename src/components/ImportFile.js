import React, { createRef } from "react";
import DB from "lib/Database";

class ImportFile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.$input = createRef();
  }
  importFile = ({ target }) => {
    if (target.files.length === 1) {
      let epub = target.files[0];
      DB.ebooks
        .put(epub)
        .then((result) => {
          if (this.props.loadFile) this.props.loadFile(result.id);
        })
        .catch((err) => console.error(err));
    } else {
      for (let k = 0; k < target.files.length; k++) {
        DB.ebooks.put(target.files[k]).catch((err) => console.error(err));
      }
    }
  };

  click = () => {
    this.$input.current.click();
  };

  render = () => {
    return (
      <input
        ref={this.$input}
        accept="application/pdf,.epub"
        type="file"
        multiple
        onChange={this.importFile}
        style={{ display: "none" }}
      />
    );
  };
}
export default ImportFile;
