import React from "react";
import {
  HomeTwoTone,
  ExperimentTwoTone,
  SettingTwoTone,
} from "@ant-design/icons";

import Ereader from "pages/Ereader";
import Settings from "pages/Settings";

const routes = [
  {
    to: "/",
    exact: true,
    label: "Home",
    icon: <HomeTwoTone twoToneColor="#52c41a" />,
    component: Ereader,
  },
  {
    to: "/about",
    label: "About",
    icon: <ExperimentTwoTone twoToneColor="#52c41a" />,
    component: Settings,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: <SettingTwoTone twoToneColor="#52c41a" />,
    component: Settings,
  },
];

export default routes;
