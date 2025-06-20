/* @refresh reload */
import "./index.css";

import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import App from "./app";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ServiceRegistry } from "solid-services";
import { JSX } from "solid-js";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

export function renderWithProviders(component: () => JSX.Element) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceRegistry>
        <Router>{component()}</Router>
      </ServiceRegistry>
    </QueryClientProvider>
  );
}

render(() => renderWithProviders(() => <App />), root);