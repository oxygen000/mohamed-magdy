import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import NextToploader from "nextjs-toploader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NextToploader
        color="linear-gradient(to right, #1958df, #1e7944)"
        height={4}
        showSpinner={false}
        shadow="0 0 10px #1958df"
      />

      <App />
    </BrowserRouter>
  </StrictMode>
);
