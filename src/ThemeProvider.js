import React, { useState } from "react";
// https://github.com/mateenkiani/react-tutorials.git
export const ThemeContext = React.createContext({
  theme: {
    type: "light",
    primary: "#00bfa5",
    text: "#black",
  },
  setTheme: () => {},
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
  };

  const setTheme = (type) => {
    setState({ ...state, theme: type === "dark" ? theme.light : theme.dark });
  };

  const initState = {
    theme: theme.light,
    setTheme: setTheme,
  };

  const [state, setState] = useState(initState);

  return (
    <ThemeContext.Provider value={state}>
      {props.children}
    </ThemeContext.Provider>
  );
};
