import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import HomePage from "./pages/homePage";
import AboutData from "./pages/about.data";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/aboutPage")),
    data: AboutData,
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
