import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReactQueryProvider } from "./provider/ReactQueryProvider.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StateProvider } from "./context/state.context.tsx";
import { ConfirmDialog } from "./components/alert-box.tsx";
import { HelmetProvider } from "react-helmet-async";
import { useThemeConfig } from "./components/setting.tsx";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  // Just calling the hook runs the initialization logic and watches for changes
  useThemeConfig();
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeInitializer>
        <ReactQueryProvider>
          <BrowserRouter>
            <StateProvider>
              <ConfirmDialog>
                <App />
              </ConfirmDialog>
            </StateProvider>
            <Toaster />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </ThemeInitializer>
    </HelmetProvider>
  </StrictMode>,
);
