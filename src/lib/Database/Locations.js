import Database from "./Database";

const current = "+current";
export default class Locations extends Database {
  put = (args) => {
    this.db.put(args).catch((err) => console.error(err));
  };
  update = (_id, location) => {
    console.warn(_id);
    this.db
      .get(_id)
      .then((doc) => {
        // console.log("must remove", doc);
        this.db.remove(doc).then(() => this.put({ _id, location }));
      })
      .catch(() => {
        console.log("the above error is totally normal");
        this.put({ _id, location });
      });
  };

  getCurrent = () => {
    console.warn("get current in ", this.db);
    this.db.allDocs().then((docs) => console.log(docs));
    return new Promise((resolve, reject) => {
      this.db
        .get(current)
        .then(this.db.allDocs().then((docs) => console.log(docs)))
        .catch(reject);
    });
  };

  updateCurrent = (docId) => {
    console.warn("updateCurrent", docId);
    return;
    this.db
      .get(current)
      .then((current) => {
        if (current.docId !== docId) {
          this.db
            .remove(current)
            .then(() => this.db.put({ _id: current, docId }));
        }
      })
      .catch((err) => this.put({ _id: current, docId }));
  };
}
