import React, { useContext } from "react";
import { Select } from "antd";
import { ThemeContext } from "ThemeProvider";
export default function SelectFontSize() {
  const context = useContext(ThemeContext);

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
      defaultValue={{ key: context.fontSize + "%" }}
      onChange={({ value }) => context.setFontSize(value)}
    >
      {options}
    </Select>
  );
}
