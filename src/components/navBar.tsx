import ColorModeToggle from "./colorModeToggle";
import NavBarLink from "./navBarLink";

export default function NavBar() {
  return (
    <nav class="top-0 sticky bg-background text-secondary-foreground px-4 py-4 border-b-2">
      <ul class="flex items-center">
        <div class="flex-1" />
        <li class="py-2 px-4">
          <NavBarLink path="/">Home</NavBarLink>
        </li>
        <li class="py-2 px-4">
          <NavBarLink path="/about">About</NavBarLink>
        </li>
        <div class="flex-1" />

        <ColorModeToggle />
      </ul>
    </nav>
  );
}
