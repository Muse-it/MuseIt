import { For, Setter, Show } from "solid-js";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useService } from "solid-services";
import { RecentSearchesService } from "~/lib/recentSearches";
import { RiSystemDeleteBin6Line } from "solid-icons/ri";

function RecentSearchTile(props: { search: string }) {
  return (
    <div class="place-items-center hover:bg-muted rounded-md transition-colors duration-200">
      <p class="p-3">{props.search}</p>
    </div>
  );
}

export default function RecentSearchesCard(props: {
  setSearch: Setter<string>;
}) {
  const recentSearchesService = useService(RecentSearchesService);

  return (
    <div class="">
      <Card class="m-4 p-8" style={{ "min-height": "50vh" }}>
        <div class="flex items-center">
          <h1 class="text-3xl font-bold m-4">Recent Searches</h1>
          <div class=" flex-1 text-right">
            <Button
              variant="ghost"
              class="text-error-foreground"
              onClick={() => recentSearchesService().clearRSearches()}
            >
              <RiSystemDeleteBin6Line />
            </Button>
          </div>
        </div>
        <div>
          <Show when={recentSearchesService().recentSearches.length > 0}>
            <For each={recentSearchesService().recentSearches}>
              {(item, index) => (
                <div onClick={() => props.setSearch(item)}>
                  <RecentSearchTile search={item} />
                </div>
              )}
            </For>
          </Show>
          <Show when={recentSearchesService().recentSearches.length <= 0}>
            <RecentSearchTile search="No Recent Searches!" />
          </Show>
        </div>
      </Card>
    </div>
  );
}
