import React from "react";
import { Tag } from "antd";

const getTag = (subject) => {
  if (typeof subject === "string") return subject;
  let keys = Object.keys(subject);
  if (keys.length === 1 && keys[0] === "$" && subject.$.nil === "true")
    return "wtf";
  if (keys.length === 2 && keys.includes("_") && keys.includes("$"))
    return subject._;
};
const tags = (names) =>
  names
    .filter((v, i, a) => a.indexOf(v) === i) // get unique names
    .map((subject) => <Tag key={subject}>{subject}</Tag>);

export default function Tags({ subject, shelves }) {
  if (subject) {
    if (typeof subject === "string") return <Tag>{subject}</Tag>;

    return tags(subject.map(getTag));
  }

  if (shelves) {
    let shelve_names = shelves
      .map((shelve) => shelve.$.name)
      .filter((v, i, a) => a.indexOf(v) === i);
    return tags(shelve_names);
  }
  return null;
}
