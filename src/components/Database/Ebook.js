import React from "react";
import { connect } from "react-redux";
import JSZip from "jszip";
import { parseString as parseXml } from "xml2js";
import { toImport, loadFile } from "pages/Ebook/store";
import { DatabaseContext } from "DatabaseProvider";

class EbookDatabase extends React.Component {
  static contextType = DatabaseContext;

  render = () => null;

  componentDidUpdate = () => {
    if (this.props.toImport) {
      let file = this.props.toImport;
      this.put(this.props.toImport)
        .catch((err) => {
          console.error(err);
        })
        .then((e) => {
          this.props.dispatch(toImport(null));
          this.props.dispatch(loadFile({ docId: file.name }));
        });
    }
  };

  put = (epub) => {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = reject;

      reader.onload = (e) => {
        let jszip = new JSZip();
        jszip.loadAsync(e.target.result).then((zip) => {
          zip
            .file("META-INF/container.xml")
            .async("string")
            .then((container) => {
              this.parseContainer(container, zip, resolve, reject);
            });
        });
      };
      reader.readAsArrayBuffer(epub);
    });
  };

  parseContainer = (container, zip, resolve, reject) => {
    parseXml(container, (err, result) => {
      if (err) reject(err);
      let rootfile = result.container.rootfiles[0].rootfile[0].$["full-path"];
      zip
        .file(rootfile)
        .async("string")
        .then((content_opf) =>
          this.parseContentOPF(content_opf, zip, resolve, reject)
        );
    });
  };

  parseContentOPF = (content_opf, zip, resolve, reject) => {
    parseXml(content_opf, (err, result) => {
      if (err) reject(err);
      let epub = this.props.toImport;
      let _id = epub.lastModified + " " + epub.name;
      let cover = result.package.manifest[0].item[0].$;
      let metadata = result.package.metadata[0];
      let title = metadata["dc:title"][0];
      let identifier = metadata["dc:identifier"][0]._;

      zip
        .file(cover.href)
        .async("array")
        .then((coverData) => {
          this.context.ebooks
            .put({
              _id,
              title,
              identifier,
              metadata,
              _attachments: {
                epub: {
                  name: epub.name,
                  type: epub.type,
                  data: epub,
                },
                cover: coverData,
              },
            })
            .then(resolve)
            .catch(reject);
        });
    });
  };
}

function mapStateToProps(state) {
  return {
    toImport: state.ebook.toImport,
  };
}

export default connect(mapStateToProps)(EbookDatabase);

EbookDatabase.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: "Ebooks Database",
};
