import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import HomePage from "./pages/homePage";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/settings",
    component: lazy(() => import("./pages/settingsPage")),
  },
  {
    path: "/result/:source/:search",
    component: lazy(() => import("./pages/resultPage")),
  },
  {
    path: "**",
    component: lazy(() => import("./pages/404")),
  },
];
