import React from "react";
import { Item } from "react-contexify";
import { Link } from "react-router-dom";
import {
  HomeTwoTone,
  ExperimentTwoTone,
  SettingTwoTone,
} from "@ant-design/icons";

function ItemLink(props) {
  const { icon, to } = props;

  return (
    <Item>
      <Link to={to}>
        {icon ? icon : null}
        {props.children}
      </Link>
    </Item>
  );
}
export default function RoutesMenu() {
  return (
    <>
      <ItemLink
        to="/"
        primary="Home"
        icon={<HomeTwoTone twoToneColor="#52c41a" />}
      >
        Home
      </ItemLink>
      <ItemLink to="/people" icon={<ExperimentTwoTone />}>
        About
      </ItemLink>
      <ItemLink to="/settings" primary="Settings" icon={<SettingTwoTone />}>
        Settings
      </ItemLink>
    </>
  );
}
