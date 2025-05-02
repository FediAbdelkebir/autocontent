import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme/theme-provider";

// Import Remix icon stylesheet for icons
import "remixicon/fonts/remixicon.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="content-automation-theme">
    <App />
  </ThemeProvider>
);
