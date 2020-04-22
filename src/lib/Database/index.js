import PouchDB from "pouchdb";

import Ebooks from "./Ebooks";
import localforage from "localforage";

/*
const server = "http://localhost";
const port = 5984;

const pouch_db = (dbName) => new PouchDB(`${server}:${port}/${dbName}`);
*/
const pouch_db = (dbName) => new PouchDB(dbName);

// default context
const DB = {
  ebooks: new Ebooks(pouch_db("epubs")),
  locations: localforage.createInstance({
    name: "locations",
    driver: localforage.LOCALSTORAGE,
  }),

  //locations: new Locations(pouch_db("locations")),
};

export default DB;
