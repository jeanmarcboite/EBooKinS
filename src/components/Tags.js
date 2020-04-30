import React from "react";
import { Tag } from "antd";
export default function Tags({ subject }) {
  if (subject) {
    if (typeof subject === "string") return <Tag>{subject}</Tag>;
    return (
      <div>
        {subject.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    );
  }
  return null;
}
