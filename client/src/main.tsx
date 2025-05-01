import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Remix icon stylesheet for icons
import "remixicon/fonts/remixicon.css";

createRoot(document.getElementById("root")!).render(<App />);
