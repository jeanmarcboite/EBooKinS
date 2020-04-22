import PouchDB from "pouchdb";

import Ebooks from "./Ebooks";
import Locations from "./Locations";
/*
const server = "http://localhost";
const port = 5984;

const pouch_db = (dbName) => new PouchDB(`${server}:${port}/${dbName}`);
*/
const pouch_db = (dbName) => new PouchDB(dbName);

// default context
const DB = {
  ebooks: new Ebooks(pouch_db("epubs")),
  //locations: new Locations(pouch_db("locations")),
};

export default DB;
