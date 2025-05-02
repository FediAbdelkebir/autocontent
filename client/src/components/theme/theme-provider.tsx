import React, { createContext, useContext, useEffect, useState } from "react";

// Define the theme types
type Theme = "dark" | "light" | "system";

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// The shape of our theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
});

// The actual provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  // Initialize theme state from localStorage or default
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(storageKey);
      // Only use saved theme if it's a valid theme option
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        return savedTheme;
      }
    }
    return defaultTheme;
  });

  // Track whether dark mode is active (derived from theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Handle system preference media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Set initial dark mode state
    const updateDarkModeState = () => {
      if (theme === "system") {
        setIsDarkMode(mediaQuery.matches);
      } else {
        setIsDarkMode(theme === "dark");
      }
    };
    
    // Call initially
    updateDarkModeState();
    
    // Add listener for system preference changes
    const handleChange = () => {
      if (theme === "system") {
        setIsDarkMode(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply the theme to the document when isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;

    // Set or remove the 'dark' class
    if (isDarkMode) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document.body.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      document.body.style.colorScheme = "light";
    }

    // Force a repaint to ensure the theme is applied immediately
    const scrollY = window.scrollY;
    window.scrollTo(0, scrollY + 1);
    window.scrollTo(0, scrollY);
  }, [isDarkMode]);

  // Create the setTheme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (newTheme === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemIsDark);
    } else {
      setIsDarkMode(newTheme === "dark");
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Create the context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    isDarkMode,
  };

  // Return the provider
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};