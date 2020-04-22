import PouchDB from "pouchdb";

export default class Database {
  constructor(name) {
    console.log("connect to", name);
    this.db = new PouchDB(name);
  }
}
