import PouchDB from "pouchdb";

export default class Database {
  constructor(name) {
    this.db = new PouchDB(name);
   }
}
