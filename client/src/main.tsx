import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/theme-provider";

// Import Remix icon stylesheet for icons
import "remixicon/fonts/remixicon.css";

// Mark document as loaded after a short delay to enable CSS transitions
setTimeout(() => {
  document.documentElement.classList.add('loaded');
}, 200);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="content-automation-theme">
    <App />
  </ThemeProvider>
);
