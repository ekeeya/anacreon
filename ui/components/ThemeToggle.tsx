"use client";

import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  let theme: "light" | "dark" = "light";
  let toggleTheme = () => {};

  try {
    const ctx = useTheme();
    theme = ctx.theme;
    toggleTheme = ctx.toggleTheme;
  } catch {
    // If provider is missing, fall back to DOM toggle
    toggleTheme = () => {
      if (typeof document !== "undefined") {
        const isDark = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", !isDark);
        try { localStorage.setItem("theme", !isDark ? "dark" : "light"); } catch {}
      }
    };
    if (typeof document !== "undefined") {
      theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full p-2 hover:scale-105 transition-transform bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
    </button>
  );
}


