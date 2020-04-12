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
      type: "light",
      primary: "#0277bd",
      text: "black",
    },
    dark: {
      type: "dark",
      primary: "#212121",
      text: "white",
    },
    chocolate: {
      type: "chocolate",
      background: "#ffddb0",
      text: "#ff0000",
    },
  };

  const setTheme = (type) => {
    console.log("settheme", type);
    localStorage.setItem("theme", type);
    setState({ ...state, theme: theme[type] });
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
