import React from "react";
import { Redirect } from "react-router-dom";
import {
  ReadOutlined,
  FileSearchOutlined,
  ExperimentTwoTone,
  SettingTwoTone,
} from "@ant-design/icons";

import Ebook from "pages/Ebook";
import Library from "pages/Library";
import Settings from "pages/Settings";
import Lab from "pages/Lab";

import { store } from "store";

const routes = [
  {
    to: "/",
    exact: true,
    label: "Read",
    icon: <ReadOutlined twoToneColor="#52c41a" />,
    component: () => (
      <Redirect to={"/read/" + store.getState().ebook.url}></Redirect>
    ),
  },
  {
    to: "/read/:id",
    component: Ebook,
  },
  {
    to: "/library",
    label: "Library",
    icon: <FileSearchOutlined />,
    component: Library,
  },
  {
    to: "/about",
    label: "About",
    icon: <ExperimentTwoTone twoToneColor="#52c41a" />,
    component: Settings,
  },
  {
    to: "/lab",
    label: "Le Lab",
    icon: <ExperimentTwoTone twoToneColor="#770077" />,
    component: Lab,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: <SettingTwoTone twoToneColor="#52c41a" />,
    component: Settings,
  },
];

export default routes;
