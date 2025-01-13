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
    <div class="text-right">
      <Button class="text-xl" variant="ghost" onClick={() => toggleColorMode()}>
        {colorMode() === "light" ? <FiMoon /> : <FiSun />}
      </Button>
    </div>
  );
}
