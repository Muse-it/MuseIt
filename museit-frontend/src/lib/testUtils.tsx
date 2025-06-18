import { render } from "solid-js/web";
import { renderWithProviders } from "../index";
import { JSX } from "solid-js";

export function setupRender(component: () => JSX.Element) {
  Object.defineProperty(import.meta, 'env', {
    value: { DEV: false },
  });
  // Check if a root element already exists, and create one if it doesn't
  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.setAttribute("id", "root"); // Ensure it matches the expected root ID
    document.body.appendChild(root);
  }

  // Render the component with providers
  render(() => renderWithProviders(component), root);

  return root;
}