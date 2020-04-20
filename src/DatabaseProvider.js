import React, { useState } from "react";
import PouchDB from "pouchdb";

export const DatabaseContext = React.createContext({
  db: new PouchDB("http://localhost:5984/ebookins"),
});

export const DatabaseContextProvider = (props) => {
  const [state] = useState({
    db: new PouchDB("http://localhost:5984/ebookinss"),
  });
  return (
    <DatabaseContext.Provider value={state}>
      {props.children}
    </DatabaseContext.Provider>
  );
};
