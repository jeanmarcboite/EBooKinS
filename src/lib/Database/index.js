import Ebooks from "./Ebooks";
import localforage from "localforage";

const server = "http://localhost";
const port = 5984;

// default context
const DB = {
  ebooks: new Ebooks("epubs", server, port),
  locations: localforage.createInstance({
    name: "locations",
    driver: localforage.LOCALSTORAGE,
  }),
};

export default DB;
