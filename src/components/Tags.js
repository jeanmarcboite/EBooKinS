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

export default function Tags({ subject }) {
  if (subject) {
    if (typeof subject === "string") return <Tag>{subject}</Tag>;

    // get unique subjects
    let subjects = subject.map(getTag).filter((v, i, a) => a.indexOf(v) === i);
    return (
      <div>
        {subjects.map((subject) => (
          <Tag key={subject}>{subject}</Tag>
        ))}
      </div>
    );
  }
  return null;
}
