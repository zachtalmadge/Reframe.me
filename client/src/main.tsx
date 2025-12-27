import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global styles - Phase 1 Step 2: Consolidated from inline style blocks
import "./styles/fonts.css";
import "./styles/animations.css";
import "./styles/backgrounds.css";
import "./styles/layout.css";

createRoot(document.getElementById("root")!).render(<App />);
