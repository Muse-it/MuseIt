import { Link } from "@solidjs/router";
import { JSXElement } from "solid-js";

export default function NavBarLink(props: {
  path: string;
  children: JSXElement;
}) {
  return (
    <Link
      href={props.path}
      class="no-underline hover:text-muted-foreground transition-colors duration-300"
    >
      {props.children}
    </Link>
  );
}
