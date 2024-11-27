import ColorModeToggle from "./colorModeToggle";
import NavBarLink from "./navBarLink";

export default function NavBar() {
  return (
    <nav class="top-0 sticky bg-background text-secondary-foreground px-4 py-4 border-b-2">
      <ul class="flex items-center">
        <div class="flex-0">
          <img class="rounded-m h-10" src="/logo.png" alt="MuseIt Logo" />
        </div>
        <div class="flex-1">
          <h2 class="font-extrabold tracking-widest text-xl ml-5">MUSE-IT</h2>
        </div>
        <ul class=" flex">
          <li class="py-2 px-4">
            <NavBarLink path="/">Home</NavBarLink>
          </li>
          <li class="py-2 px-4">
            <NavBarLink path="/about">About</NavBarLink>
          </li>
        </ul>
        <div class="flex-1">
          <ColorModeToggle />
        </div>
      </ul>
    </nav>
  );
}
