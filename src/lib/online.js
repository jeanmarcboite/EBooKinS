import localforage from "localforage";
import axios from "axios";
import config, { urls } from "config";

const cache = localforage.createInstance({ name: config.cache.name });
async function get(URL) {
  return cache
    .getItem(URL)
    .then(function (value) {
      // This code runs once the value has been loaded
      // from the offline store.
      if (value != null) {
        return JSON.parse(value);
      }
      console.warn("get online: ", URL);
      return axios
        .get(urls.proxy.local + URL)
        .then((response) => {
          value = response;
          cache.setItem(URL, JSON.stringify(value));
          return value;
        })
        .catch((error) => {
          value = error;
          console.log(`Book not found at ${URL}: ${error}`);
          //cache.setItem(URL, JSON.stringify(value));
          return value;
        });
    })
    .catch(function (err) {
      // This code runs if there were any errors
      console.log("no value from forage " + err);

      return err;
    });
}

export default { get };
