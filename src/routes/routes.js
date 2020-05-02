import React from "react";
import { Redirect } from "react-router-dom";
import {
  ReadOutlined,
  FileSearchOutlined,
  ExperimentTwoTone,
  SettingTwoTone,
} from "@ant-design/icons";

import {
  BookPage,
  SearchPage,
  ReadPage,
  LibraryPage,
  AboutPage,
  SettingsPage,
} from "pages";
import Lab from "pages/Lab";

const routes = [
  {
    to: "/",
    exact: true,
    label: "Read",
    icon: <ReadOutlined twoToneColor="#52c41a" />,
    component: () => <Redirect to={"/read/"}></Redirect>,
  },
  {
    to: "/read/:id",
    component: ReadPage,
  },
  {
    to: "/read",
    component: ReadPage,
  },
  {
    to: "/library",
    label: "Library",
    icon: <FileSearchOutlined />,
    component: LibraryPage,
  },
  {
    to: "/book/:book_id",
    component: BookPage,
  },
  {
    to: "/about",
    label: "About",
    icon: <ExperimentTwoTone twoToneColor="#52c41a" />,
    component: AboutPage,
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
    component: SettingsPage,
  },
];

export default routes;
