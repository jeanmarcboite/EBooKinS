import React from "react";
import {
  HomeTwoTone,
  ExperimentTwoTone,
  SettingTwoTone,
} from "@ant-design/icons";

import Ebook from "pages/Ebook";
import Settings from "pages/Settings";
import Lab from "pages/Lab";

const routes = [
  {
    to: "/",
    exact: true,
    label: "Home",
    icon: <HomeTwoTone twoToneColor="#52c41a" />,
    component: Ebook,
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
