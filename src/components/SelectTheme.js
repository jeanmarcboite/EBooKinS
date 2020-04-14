import React, { useContext } from "react";
import Select from "antd";
import { ThemeContext, themes } from "ThemeProvider";
export default function SelectTheme() {
  const context = useContext(ThemeContext);
  return (
    <Select
      labelInValue
      style={{ width: "100%" }}
      defaultValue={{ key: context.theme.name }}
      onChange={({ value }) => context.setTheme(value)}
    >
      {Object.keys(themes).map((theme, key) => (
        <Select.Option key={key} value={themes[theme].name}>
          {themes[theme].name}
        </Select.Option>
      ))}
    </Select>
  );
}
