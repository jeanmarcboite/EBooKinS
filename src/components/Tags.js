import React from "react";
import { Tag } from "antd";

const getTag = (subject) => {
  if (typeof subject === "string") return <Tag key={subject}>{subject}</Tag>;
  let keys = Object.keys(subject);
  if (keys.length === 1 && keys[0] === "$" && subject.$.nil === "true")
    return null;
  if (keys.length === 2 && keys.includes("_") && keys.includes("$"))
    return <Tag key={subject._}>{subject._}</Tag>;
};

export default function Tags({ subject }) {
  if (subject) {
    if (typeof subject === "string") return <Tag>{subject}</Tag>;
    return <div>{subject.map(getTag)}</div>;
  }
  return null;
}
