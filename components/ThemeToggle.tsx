"use client";

import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  function toggleTheme() {
    const currentTheme: Theme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("dictionary-theme", nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          <Sun className="theme-toggle__sun" strokeWidth={2.2} />
          <Moon className="theme-toggle__moon" strokeWidth={2.2} />
        </span>
      </span>
    </button>
  );
}
