import { parseString } from "xml2js";
import localforage from "localforage";

import config, { urls } from "config";
import online from "lib/online";

const cacheISBN = localforage.createInstance({ name: config.books.isbn });
const cacheGoodreads = localforage.createInstance({
  name: config.books.goodreads,
});

export default class Book {
  constructor(id) {
    this.id = id;
  }

  getFromGoodreadsID = () => {
    return new Promise((resolve, reject) => {
      cacheGoodreads
        .getItem(this.id)
        .then((value) => {
          if (value) resolve(JSON.parse(value));
          else {
            if (!urls.goodreads.id) reject(new Error("no goodreads key"));
            online.get(urls.goodreads.id(this.id)).then((goodreads) => {
              let value = parseBookResponses({ goodreads });
              cacheGoodreads.setItem(this.id, JSON.stringify(value));
              resolve(value);
            });
          }
        })
        .catch(reject);
    });
  };
  getFromISBN = () => {
    return new Promise((resolve, reject) => {
      cacheISBN
        .getItem(this.id)
        .then((value) => {
          if (value) resolve(JSON.parse(value));
          else {
            let onlines = ["librarything", "goodreads"].filter((lib) => {
              return "isbn" in urls[lib];
            });
            let promises = onlines.map((lib) => {
              let URL = urls[lib].isbn(this.id);

              return online.get(URL);
            });
            Promise.all(promises).then((values) => {
              const responses = {};
              onlines.forEach((lib, k) => {
                responses[lib] = values[k];
              });
              let value = parseBookResponses(responses);
              cacheISBN.setItem(this.id, JSON.stringify(value));
              resolve(value);
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
          console.log(librarything.author.$.id);
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
