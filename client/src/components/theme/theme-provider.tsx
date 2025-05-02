import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Get initial theme from localStorage or use defaultTheme
  const [theme, setTheme] = useState<Theme>(
    () => {
      // Try to get from localStorage first
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme;
      }
      return defaultTheme;
    }
  );

  // Apply the theme whenever it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // First remove any existing theme classes
    root.classList.remove("light", "dark");
    
    const applyTheme = (activeTheme: string) => {
      console.log(`Applying theme: ${activeTheme}`);
      root.classList.add(activeTheme);
      root.setAttribute('data-theme', activeTheme);
      
      // Force a repaint by making a tiny layout change and reverting it
      const currentHeight = root.style.minHeight;
      root.style.minHeight = '100.001vh';
      setTimeout(() => {
        root.style.minHeight = currentHeight;
      }, 10);
    };

    if (theme === "system") {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      applyTheme(systemTheme);
    } else {
      // Apply theme directly
      applyTheme(theme);
    }
    
    // Store the theme in localStorage to persist it
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  // Monitor system preference changes if using system theme
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};