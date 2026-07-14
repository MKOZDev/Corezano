"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(current);
  }, []);

  const setTheme = useCallback((newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("cv-theme", newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
