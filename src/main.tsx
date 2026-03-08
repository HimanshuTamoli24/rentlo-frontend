import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReactQueryProvider } from "./provider/ReactQueryProvider.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StateProvider } from "./context/state.context.tsx";

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ReactQueryProvider>
        <BrowserRouter>
          <StateProvider>
            <App />
          </StateProvider>
          <Toaster />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>
    </HelmetProvider>
  </StrictMode>,
);
