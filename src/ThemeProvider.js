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

export const ThemeContextProvider = (props) => {
  const theme = {
    light: {
      name: "light",
      type: "light",
      primary: "#0277bd",
      text: "black",
      submenu: {
        color: "#000000",
        background: "#FFFFFF",
      },
    },
    dark: {
      name: "dark",
      type: "dark",
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
    console.log("settheme", name);
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
