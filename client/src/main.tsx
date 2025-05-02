import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "remixicon/fonts/remixicon.css";

// Immediately set the initial theme based on localStorage or default to dark
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to dark mode if no saved preference
  const isDark = savedTheme === 'light' ? false : savedTheme === 'dark' ? true : prefersDark;
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Remember this preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Run immediately
initializeTheme();

// Mark document as loaded after a short delay to enable CSS transitions
setTimeout(() => {
  document.documentElement.classList.add('loaded');
}, 200);

createRoot(document.getElementById("root")!).render(<App />);
