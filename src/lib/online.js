import localforage from "localforage";
import axios from "axios";
import urls from "config/urls";
import consola from "consola";

const cache = localforage.createInstance({ name: "cache" });
async function get(URL) {
  return cache
    .getItem(URL)
    .then(function (value) {
      // This code runs once the value has been loaded
      // from the offline store.
      if (value != null) {
        value = JSON.parse(value);

        return value;
      }
      return axios
        .get(urls.proxy + URL)
        .then((response) => {
          value = response;
          localforage.setItem(URL, JSON.stringify(value));
          return value;
        })
        .catch((error) => {
          value = error;
          localforage.setItem(URL, JSON.stringify(value));
          return value;
        });
    })
    .catch(function (err) {
      // This code runs if there were any errors
      consola.log("no value from forage " + err);

      return err;
    });
}

export default { get };
