import React, { useState } from "react";
// https://github.com/mateenkiani/react-tutorials.git
export const ThemeContext = React.createContext({
  theme: {
    type: "light",
    primary: "#00bfa5",
    text: "#black",
  },
});

const defaultTheme = {
  name: "default",
  type: "light",
  background: "white",
  primary: "#0277bd",
  text: "black",
  submenu: {
    color: "#000000",
    background: "#FFFFFF",
  },
  ebook_iframe_body: {
    color: "#000000",
    background: "#FFFFFF",
  },
};

const light = {
  ...defaultTheme,
  name: "light",
  submenu: {
    ...defaultTheme.submenu,
    background: "papayawhip",
  },
  ebook_iframe_body: {
    ...defaultTheme.ebook_iframe_body,
    background: "papayawhip",
  },
};

const chocolate = {
  ...defaultTheme,
  name: "chocolate",
  submenu: {
    ...defaultTheme.submenu,
    background: "papayawhip",
  },
  ebook_iframe_body: {
    color: "blue",
    background: "#ffddb0",
  },
};
const dark = {
  ...defaultTheme,
  name: "dark",
  type: "dark",
  submenu: {
    color: "#eeeeee",
    background: "#212121",
  },
  ebook_iframe_body: {
    color: "white",
    background: "#121212",
  },
};

export const themes = {
  default: defaultTheme,
  light,
  chocolate,
  dark,
};

export const ThemeContextProvider = (props) => {
  const setTheme = (name) => {
    localStorage.setItem("theme", name);
    setState({ ...state, theme: themes[name] });
  };

  const setFontSize = (value) => {
    let fontSize = 100;
    if (typeof value == "number" && value > 30) fontSize = value;
    localStorage.setItem("fontSize", fontSize);
    setState({ ...state, fontSize });
  };

  const initState = {
    theme: themes[localStorage.getItem("theme") || "default"],
    fontSize: localStorage.getItem("fontSize") || 100,
    setTheme,
    setFontSize,
  };

  const [state, setState] = useState(initState);

  return (
    <ThemeContext.Provider value={state}>
      {props.children}
    </ThemeContext.Provider>
  );
};
