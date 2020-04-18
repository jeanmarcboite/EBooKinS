import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { parseString } from "xml2js";

export function parseEpub(epubContent) {
  let jszip = new JSZip();
  console.log("parseEpub");
  jszip.loadAsync(epubContent).then(function (zip) {
    console.log(zip.files);
    zip
      .file("content.opf")
      .async("string")
      .then((text) => {
        parseString(text, function (err, result) {
          console.log("content.opf", result);
          console.log(result.package.metadata[0]);
          let cover = result.package.manifest[0].item[0].$;

          zip
            .file(cover.href)
            .async("array")
            .then((array) => console.log(array));
        });
      });
  });
}

function onload(db, epub, epubContent) {
  let jszip = new JSZip();
  jszip.loadAsync(epubContent).then((zip) => {
    //console.warn(zip.files);
    zip
      .file("content.opf")
      .async("string")
      .then((text) => {
        parseString(text, function (err, result) {
          console.log("content.opf", result);
          console.log(result.package.metadata[0]);
          let cover = result.package.manifest[0].item[0].$;

          zip
            .file(cover.href)
            .async("array")
            .then((array) => {
              db.put({
                _id: epub.name,
                metadata: result.package.metadata[0],
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
                  console.log("db.put: ", response);
                })
                .catch(function (err) {
                  console.error(err);
                });
            });
        });
      });
  });
}

export function storeEpub(db, epub) {
  if (db) {
    let reader = new FileReader();
    reader.onload = () => onload(db, epub, reader.result);
    reader.readAsArrayBuffer(epub);
  }

  return epub.name;
}
