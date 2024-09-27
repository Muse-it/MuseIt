import { For, Show } from "solid-js";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { recentSearchesStore } from "~/lib/recentSearches";

function RecentSearchTile(props: { search: string }) {
  return (
    <div class="place-items-center hover:bg-muted rounded-md transition-colors duration-200">
      <p class="p-3">{props.search}</p>
    </div>
  );
}

export default function RecentSearchesCard() {
  const rSearches = recentSearchesStore((s) => s.rSearches);
  const clearRSearches = recentSearchesStore((s) => s.clearRSearches);

  return (
    <div class="">
      <Card class="m-4 p-8" style={{ "min-height": "50vh" }}>
        <div class="flex items-center">
          <h1 class="text-3xl font-bold m-4">Recent Searches</h1>
          <Button variant="ghost" onClick={clearRSearches}>
            Clear Searches
          </Button>
        </div>
        <div>
          <Show when={rSearches().length > 0}>
            <For each={rSearches()}>
              {(item, index) => <RecentSearchTile search={item} />}
            </For>
          </Show>
          <Show when={rSearches().length <= 0}>
            <RecentSearchTile search="No Recent Searches!" />
          </Show>
        </div>
      </Card>
    </div>
  );
}
