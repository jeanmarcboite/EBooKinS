import JSZip from "jszip";
import { parseString as parseXml } from "xml2js";

import PouchDB from "pouchdb";

import EventEmitter from "event-emitter";

const logChanges = false;
const get = (metadata, key) => {
  let value = metadata[key] ? metadata[key][0] : "";

  if (typeof value == "string") return value;

  if ("_" in value) return value._;

  return JSON.stringify(value);
};

export default class Ebooks {
  constructor(name, server, port) {
    this.name = name;
    this.db = new PouchDB(name);
    this.sync(server, port);
  }

  sync = (server, port) => {
    if (server) {
      let p = port ? port : 5984;
      this.remote = new PouchDB(`${server}:${p}/${this.name}`);
      this.db
        .sync(this.remote, {
          live: true,
          retry: true,
        })
        .on("change", (change) => this.emit("update"))
        .on("paused", function (info) {
          // replication was paused, usually because of a lost connection
          if (logChanges) console.log("replication paused", info);
        })
        .on("active", function (info) {
          // replication was resumed
          if (logChanges) console.log("replication resumed", info);
        })
        .on("error", function (err) {
          // totally unhandled error (shouldn't happen)
          console.error("replication error", err);
        });
    }
    return 0;
  };

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
      let identifier = metadata["dc:identifier"][0]._;

      let title = get(metadata, "dc:title");
      let description = get(metadata, "dc:description");
      let subject = metadata["dc:subject"] ? metadata["dc:subject"] : [];
      let ISBN = "";
      metadata["dc:identifier"].forEach((identifier) => {
        if (typeof identifier == "string") {
          if (identifier.startsWith("isbn:")) ISBN = identifier.slice(5);
        } else {
          if (identifier.$["opf:scheme"] === "ISBN")
            // TODO "AMAZON_FR"
            ISBN = identifier._;
        }
      });

      let data = {
        _id,
        title,
        description,
        subject,
        identifier,
        metadata,
        _attachments: {
          epub: {
            content_type: epub.type,
            data: epub,
          },
        },
      };
      if (ISBN.length > 0) {
        data._id = ISBN;
        data.ISBN = ISBN;
      }

      if (metadata["dc:creator"]) {
        data.creator = metadata["dc:creator"][0];
        if (data.creator.$["opf:role"] === "aut") data.author = data.creator._;
      }

      let zipCover = zip.file(cover.href);
      if (!zipCover) this.db.put(data).then(resolve).catch(reject);
      else {
        zipCover.async("blob").then((coverData) => {
          data._attachments.cover = {
            content_type: "image/jpeg",
            data: coverData,
          };
          this.db.put(data).then(resolve).catch(reject);
        });
      }
    });
  };
}

EventEmitter(Ebooks.prototype);
