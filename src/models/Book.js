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
      cacheGoodreads.getItem(this.id).then((value) => {
        if (value) resolve(JSON.parse(value));
        else {
          let key = localStorage.getItem("GOODREADS_KEY");
          online.get(urls.goodreads.id(this.id, key)).then((response) => {
            console.log(response);
            resolve(response);
          });
        }
      });
    });
  };
  getFromISBN = () => {
    return new Promise((resolve, reject) => {
      cacheISBN
        .getItem(this.id)
        .then((value) => {
          if (value) resolve(JSON.parse(value));
          else {
            let onlines = ["librarything", "goodreads"];
            let promises = onlines.map((lib) => {
              let key = localStorage.getItem(lib.toUpperCase() + "_KEY");
              let URL = urls[lib].isbn(this.id, key);

              return online.get(URL);
            });
            Promise.all(promises).then(function (values) {
              const responses = {};
              onlines.forEach((lib, k) => {
                responses[lib] = values[k];
              });
              resolve(parseBookResponses(responses));
            });
          }
        })
        .catch(reject);
    });
  };
}
const parseBookResponses = (responses) => {
  let book = { data: {}, library: {} };
  if ("goodreads" in responses) {
    let goodreads = { statusText: responses.goodreads.statusText };
    if (responses.goodreads.status === 200) {
      parseString(responses.goodreads.data, function (err, result) {
        let gbook = result.GoodreadsResponse.book[0];
        for (var key in gbook) {
          if (gbook.hasOwnProperty(key)) {
            if (Array.isArray(gbook[key]) && gbook[key].length === 1) {
              goodreads[key] = gbook[key][0];
            } else {
              goodreads[key] = gbook[key];
            }
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
