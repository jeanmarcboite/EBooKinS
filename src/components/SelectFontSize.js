import React from "react";
import { Select } from "antd";
export default function SelectFontSize(props) {
  let options = [];
  //Inner loop to create children
  for (let size = 50; size <= 150; size += 10) {
    options.push(
      <Select.Option key={size} value={size}>
        {size}%
      </Select.Option>
    );
  }
  return (
    <Select
      labelInValue
      style={{ width: "100%" }}
      defaultValue={{ key: props.value + "%" }}
      onChange={props.onChange}
    >
      {options}
    </Select>
  );
}
