import React, { useState } from "react";
import { RedEnvelopeFilled } from "@ant-design/icons";
// https://github.com/mateenkiani/react-tutorials.git
export const ThemeContext = React.createContext({
  theme: {
    type: "light",
    primary: "#00bfa5",
    text: "#black",
  },
});

const light = {
  name: "light",
  type: "light",
  background: "white",
  primary: "#0277bd",
  text: "black",
  submenu: {
    color: "#000000",
    background: "#FFFFFF",
  },
};
export const ThemeContextProvider = (props) => {
  const theme = {
    light,
    default: light,
    dark: {
      name: "dark",
      type: "dark",
      background: "gray",
      primary: "#212121",
      text: "white",
      submenu: {
        background: "#000000",
        color: "#FFFFFF",
      },
    },
    chocolate: {
      name: "chocolate",
      type: "light",
      background: "#ffddb0",
      text: "#ff0000",
      submenu: {
        color: "blue",
        background: "papayawhip",
      },
    },
  };

  const setTheme = (name) => {
    localStorage.setItem("theme", name);
    setState({ ...state, theme: theme[name] });
  };

  const initState = {
    theme: theme[localStorage.getItem("theme") || "light"],
    setTheme,
  };

  const [state, setState] = useState(initState);

  return (
    <ThemeContext.Provider value={state}>
      {props.children}
    </ThemeContext.Provider>
  );
};
