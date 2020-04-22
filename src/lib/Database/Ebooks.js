import JSZip from "jszip";
import { parseString as parseXml } from "xml2js";

import Database from "./Database";
export default class Ebooks extends Database {
  get = (_id) => {
    return new Promise((resolve, reject) => {
      this.db
        .getAttachment(_id, "epub")
        .then(resolve)
        /*   .then((url) => {
          DB.locations.get(_id).then(resolve).catch(resolve);
        })*/
        .catch(reject);
    });
  };
  // put in a db, returning a promise
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
              this.parseContainer(epub, container, zip, resolve, reject);
            });
        });
      };
      reader.readAsArrayBuffer(epub);
    });
  };

  parseContainer = (epub, container, zip, resolve, reject) => {
    parseXml(container, (err, result) => {
      if (err) reject(err);
      let rootfile = result.container.rootfiles[0].rootfile[0].$["full-path"];
      zip
        .file(rootfile)
        .async("string")
        .then((content_opf) =>
          this.parseContentOPF(epub, content_opf, zip, resolve, reject)
        );
    });
  };

  parseContentOPF = (epub, content_opf, zip, resolve, reject) => {
    parseXml(content_opf, (err, result) => {
      if (err) reject(err);
      let _id = epub.lastModified + " " + epub.name;
      let cover = result.package.manifest[0].item[0].$;
      let metadata = result.package.metadata[0];
      let title = metadata["dc:title"][0];
      let identifier = metadata["dc:identifier"][0]._;

      zip
        .file(cover.href)
        .async("array")
        .then((coverData) => {
          this.db
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
