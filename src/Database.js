import React, { useState } from "react";
import { connect } from "react-redux";
import PouchDB from "pouchdb";
import JSZip from "jszip";
import { parseString } from "xml2js";
import { importFile } from "pages/Ebook/store";
export const dbName = "ebookins";

export const DatabaseContext = React.createContext({
  db: new PouchDB("http://localhost:5984/ebookins"),
});

// TODO return promise
function onload(db, epub, epubContent, resolve, reject) {
  let jszip = new JSZip();
  console.log(epub);
  let _id = epub.lastModified + " " + epub.name;
  jszip.loadAsync(epubContent).then((zip) => {
    console.warn(zip.files);
    zip
      .file("META-INF/container.xml")
      .async("string")
      .then((text) => {
        parseString(text, function (err, result) {
          let rootfile =
            result.container.rootfiles[0].rootfile[0].$["full-path"];
          zip
            .file(rootfile)
            .async("string")
            .then((text) => {
              parseString(text, function (err, result) {
                console.log(rootfile, result);
                console.log(result.package.metadata[0]);
                let cover = result.package.manifest[0].item[0].$;

                zip
                  .file(cover.href)
                  .async("array")
                  .then((array) => {
                    let metadata = result.package.metadata[0];
                    db.put({
                      _id,
                      title: metadata["dc:title"][0],
                      identifier: metadata["dc:identifier"][0]._,
                      metadata,
                      _attachments: {
                        epub: {
                          name: epub.name,
                          type: epub.type,
                          data: epub,
                        },
                        cover: array,
                      },
                    })
                      .then(function (response) {
                        resolve(response);
                      })
                      .catch(function (err) {
                        reject(err);
                      });
                  });
              });
            });
        });
      });
  });
}
const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};
function storeEpub(db, epub) {
  let reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error(`Could not read ${epub.name}`));
    };

    reader.onload = () => onload(db, epub, reader.result, resolve, reject);

    reader.readAsArrayBuffer(epub);
  });
}

class Database extends React.Component {
  static contextType = DatabaseContext;

  componentDidUpdate = () => {
    if (this.props.toImport) {
      storeEpub(this.context.db, this.props.toImport)
        .then(() => {
          console.log("storeEPUB OK");
          this.props.dispatch(importFile(null));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  render = () => {
    return null;
  };
}

function mapStateToProps(state) {
  return {
    toImport: state.ebook.toImport,
  };
}

export default connect(mapStateToProps)(Database);

Database.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Database",
};

export const DatabaseContextProvider = (props) => {
  const [state, setState] = useState({
    db: new PouchDB("http://localhost:5984/ebookinss"),
  });
  return (
    <DatabaseContext.Provider value={state}>
      {props.children}
    </DatabaseContext.Provider>
  );
};
