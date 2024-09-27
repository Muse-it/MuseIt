import { useRoutes } from "@solidjs/router";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";

import { routes } from "./routes";
import NavBar from "./components/navBar";

const App = () => {
  const Route = useRoutes(routes);
  const storageManager = createLocalStorageManager("museit-ui-theme");

  return (
    <div>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <div>
          <NavBar />

          <main>
            <Route />
          </main>
        </div>
      </ColorModeProvider>
    </div>
  );
};

export default App;
