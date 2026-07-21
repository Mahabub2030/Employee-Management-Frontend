import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { ThemeProvider } from "./providers/theme.provider.tsx";
import { router } from "./routes/index.tsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./redux/store.ts";
import { AuthProvider } from "./constants/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster richColors />
        </ThemeProvider>
      </AuthProvider>
    </ReduxProvider>
  </StrictMode>,
);
