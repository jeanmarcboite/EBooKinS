import React, { useState } from "react";
import PouchDB from "pouchdb";

const server = "http://localhost"
const port = 5984

const db = (dbName) => new PouchDB(`${server}:${port}/${dbName}`)

// default context
export const DatabaseContext = React.createContext({
  ebooks: db("ebooks"),
  locations: db("locations")
});

export const DatabaseContextProvider = (props) => {
  const [state] = useState({
    db: new PouchDB("http://localhost:5984/ebookins"),
  });
  return (
    <DatabaseContext.Provider value={state}>
      {props.children}
    </DatabaseContext.Provider>
  );
};
