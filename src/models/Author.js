import { parseString } from "xml2js";
import localforage from "localforage";

import config, { urls } from "config";
import online from "lib/online";

const cache = localforage.createInstance({ name: config.authors.name });

//const logg = console.log;
const logg = () => {};

class Author {
  constructor(id) {
    // goodreads not happy with Dick,Philip K.
    this.id = id.replace(" K.", "");
  }
  get = (getOnline) => {
    return new Promise((resolve, reject) => {
      cache.getItem(this.id).then((value) => {
        if (!getOnline || value) resolve(JSON.parse(value));
        else {
          if (!urls.goodreads.author) reject(new Error("no goodreads key"));
          online
            .get(urls.goodreads.author(this.id))
            .then((value) => {
              logg("get author online: ", value.data);
              if (!value.data) {
                reject(
                  new Error(
                    `goodreads: author ${this.id} not found: ${value.message}`
                  )
                );
              }
              parseString(value.data, (err, result) => {
                logg("get author online, parsed: ", result);
                if (err != null) {
                  reject(err);
                }
                if (!result.GoodreadsResponse.author) {
                  resolve({ name: this.id });
                } else {
                  let a = result.GoodreadsResponse.author[0];
                  let author = { name: a.name[0], id: a.$.id, link: a.link[0] };
                  online
                    .get(urls.goodreads.show_author(author.id))
                    .then((response) => {
                      this.parse(response, author, resolve, reject);
                    });
                }
              });
            })
            .catch(reject);
        }
      });
    });
  };
  parse = (response, author, resolve, reject) => {
    if (response.status !== 200) {
      author.error = "goodreads author request: " + response.statusText;
      reject(new Error(author.error));
    } else {
      parseString(response.data, (err, result) => {
        if (err != null) {
          author.error = "parsing goodreads response: " + err;
          reject(err);
        } else {
          author.data = result.GoodreadsResponse.author[0];
          author.image_url = author.data.image_url[0];
          author.name = author.data.name[0];
          author.fans_count = author.data.fans_count[0];
          author.about = author.data.about;
          author.influences = author.data.influences;
          cache.setItem(this.id, JSON.stringify(author));
          logg(author);
          resolve(author);
        }
      });
    }
  };
}

export default Author;
