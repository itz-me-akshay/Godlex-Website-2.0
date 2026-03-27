/**
 * J.A.R.V.I.S. Protocol Internal: Application Core Initialization
 * Status: Rendering Logic Validated | DOM Root Secured
 */
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
