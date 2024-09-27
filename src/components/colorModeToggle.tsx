import { Button } from "./ui/button";
import { useColorMode } from "@kobalte/core/color-mode";
import { FiMoon, FiSun } from "solid-icons/fi";

export default function ColorModeToggle() {
  const { colorMode, setColorMode } = useColorMode();

  function toggleColorMode() {
    if (colorMode() === "light") {
      setColorMode("dark");
    } else {
      setColorMode("light");
    }
  }

  return (
    <li class="text-sm flex items-center space-x-1 ml-auto absolute right-4">
      <Button class="text-xl" variant="ghost" onClick={() => toggleColorMode()}>
        {colorMode() === "light" ? <FiMoon /> : <FiSun />}
      </Button>
    </li>
  );
}
