import { parseString } from "xml2js";
import localforage from "localforage";

import config, { urls } from "config";
import online from "lib/online";
import DB from "lib/Database";

//const logg = console.log;
const logg = () => {};

const cacheISBN = localforage.createInstance({ name: config.books.isbn });
const cacheGoodreads = localforage.createInstance({
  name: config.books.goodreads,
});

export default class Book {
  constructor(id) {
    this.type = id.split(":", 1)[0];
    this.id = id.substring(this.type.length + 1);
  }

  get = () => {
    if (this.data) return new Promise((resolve) => resolve(this.data));

    let f = {
      db: this.getFromDB,
      goodreads: this.getFromGoodreadsID,
      isbn: this.getFromISBN,
    };

    return f[this.type](this.id);
  };

  setData = (data) => {
    //console.warn("setData", data);
    let this_data = this.data;
    this.data = { ...this_data, ...data };
  };

  getFromDB = (id) => {
    let dbID = id || this.id;
    return new Promise((resolve, reject) => {
      DB.ebooks.db.get(dbID).then((data) => {
        this.setData(data);
        logg("A getFromDB: ", this.data, data);
        resolve(data);
      }, reject);
    });
  };

  getFromGoodreadsID = (goodreadsID) => {
    return new Promise((resolve, reject) => {
      cacheGoodreads
        .getItem(goodreadsID)
        .then((value) => {
          if (value) {
            this.setData({ goodreads: JSON.parse(value) });
            logg("B getFromG cache", this.data, JSON.parse(value));
            resolve(this.data.goodreads);
          } else {
            if (!urls.goodreads.id) reject(new Error("no goodreads key"));
            online.get(urls.goodreads.id(this.id)).then((goodreads) => {
              let data = parseBookResponses({ goodreads });
              this.setData({ goodreads: data });
              cacheGoodreads.setItem(goodreadsID, JSON.stringify(data));
              logg("C getFromG online", this.data, JSON.parse(value));
              resolve(data);
            });
          }
        })
        .catch(reject);
    });
  };
  getFromISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      cacheISBN
        .getItem(isbn)
        .then((value) => {
          if (value) {
            this.setData({ library: JSON.parse(value).library });
            logg("D get from isbn cache: ", this.data, JSON.parse(value));
            resolve(this.data);
          } else {
            let onlines = ["librarything", "goodreads"].filter((lib) => {
              return "isbn" in urls[lib];
            });
            let promises = onlines.map((lib) => {
              let URL = urls[lib].isbn(isbn);

              return online.get(URL);
            });
            Promise.all(promises).then((values) => {
              const responses = {};
              onlines.forEach((lib, k) => {
                responses[lib] = values[k];
              });
              let data = parseBookResponses(responses);
              this.setData(data);
              cacheISBN.setItem(isbn, JSON.stringify(data));
              logg("D get from isbn online: ", this.data, data);
              resolve(this.data);
            });
          }
        })
        .catch(reject);
    });
  };
}

const parseGoodreadsValue = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length === 1)
    return parseGoodreadsValue(value[0]);
  let val = value;
  let keys = Object.keys(val);
  if (keys.length === 1 && keys[0] === "$" && val.$.nil === "true")
    return undefined;
  if (keys.length === 2 && keys.includes("_") && keys.includes("$")) {
    if (val.$.type === "integer") return parseInt(val._);
    return val._;
  } else {
    for (let k in val) {
      val[k] = parseGoodreadsValue(val[k]);
    }
    return val;
  }
};

const parseBookResponses = (responses) => {
  let book = { data: {}, library: {} };
  if ("goodreads" in responses) {
    let goodreads = { statusText: responses.goodreads.statusText };
    if (responses.goodreads.status === 200) {
      parseString(responses.goodreads.data, function (err, result) {
        let gbook = result.GoodreadsResponse.book[0];
        for (var key in gbook) {
          if (gbook.hasOwnProperty(key)) {
            if (key === "work")
              goodreads[key] = parseGoodreadsValue(gbook[key], true);
            else goodreads[key] = parseGoodreadsValue(gbook[key]);

            if (!(key in book.data)) {
              book.data[key] = goodreads[key];
            }
          }
        }
      });

      book.library.goodreads = goodreads;
    }
  }
  if ("librarything" in responses) {
    parseString(responses.librarything.data, function (err, result) {
      if (result && result.response.$.stat === "ok") {
        let librarything = { response: result.response };
        let ltml = result.response.ltml[0].item[0];
        librarything.id = ltml.$.id;
        let fields = ["author", "title", "rating", "url"];
        fields.forEach(function (f) {
          librarything[f] = ltml[f][0];
          if (!(f in book.data)) {
            book.data[f] = ltml[f][0];
          }
        });
        if (librarything.author.$.authorcode) {
          logg(librarything.author.$.id);
        }

        book.library.librarything = librarything;
      }
    });
  }

  if ("openlibrary" in responses) {
    if (responses.openlibrary.status !== 200) {
      book.errors.openlibrary = responses.openlibrary;
    } else {
      book.library.openlibrary = responses.openlibrary;

      for (var key in book.library.openlibrary.data) {
        let data = book.library.openlibrary.data[key];
        book.library.openlibrary.url = data.info_url;
        if (data.details.series) {
          book.data.series = data.details.series;
        }
        break;
      }
    }
  }

  return book;
};
