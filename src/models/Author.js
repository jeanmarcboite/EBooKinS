import { parseString } from "xml2js";
import localforage from "localforage";

import config, { urls } from "config";
import online from "lib/online";

const cache = localforage.createInstance({ name: config.authors.name });

class Author {
  constructor(id) {
    this.id = id;
  }
  get = () => {
    let key = localStorage.getItem("GOODREADS_KEY");
    return new Promise((resolve, reject) => {
      cache.getItem(this.id).then((value) => {
        if (value) resolve(JSON.parse(value));
        online
          .get(urls.goodreads.author(this.id, key))
          .then((value) => {
            parseString(value.data, (err, result) => {
              if (err != null) {
                reject(err);
              }
              let a = result.GoodreadsResponse.author[0];
              let author = { name: a.name[0], id: a.$.id, link: a.link[0] };
              online
                .get(urls.goodreads.show_author(author.id, key))
                .then((response) => {
                  this.parse(response, author, resolve, reject);
                });
            });
          })
          .catch(reject);
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
          author.img = author.data.image_url[0];
          author.name = author.data.name[0];
          author.fans_count = author.data.fans_count[0];
          author.about = author.data.about;
          author.influences = author.data.influences;
          cache.setItem(this.id, JSON.stringify(author));
          resolve(author);
        }
      });
    }
  };
}

export default Author;
