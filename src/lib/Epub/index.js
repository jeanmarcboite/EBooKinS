import JSZip from "jszip";
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
// TODO return promise
function onload(db, epub, epubContent) {
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
                        console.log("db.put: ", response);
                      })
                      .catch(function (err) {
                        console.error("Could not store in database:", err);
                      });
                  });
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
