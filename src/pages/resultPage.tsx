import { useParams } from "@solidjs/router";
import { Match, Switch, createSignal } from "solid-js";
import { DatapointDisplay } from "~/components/datapointsDisplay";
import ErrorCard from "~/components/errorCard";
import LoadingSpinner from "~/components/loadingSpinner";
import { PlotOptions } from "~/components/plotOptions";
import { SubclassSelect } from "~/components/subclassSelect";
import { createSearchQuery } from "~/lib/apiSignals";
import { DataSource, dataSourceInfo } from "~/lib/dataSource";
import { SubclassFilter, subclassFilterStore } from "~/lib/subclassFilter";

export default function ResultPage() {
  const params = useParams();
  const source = params.source as DataSource;
  const searchText = params.search as string;

  const searchQuery = createSearchQuery(source, searchText);

  function TitleElement() {
    return (
      <div class="m-2 mt-4 p-2 shadow-none">
        <div class="text-xl">
          <span class="text-muted-foreground">
            Searching with {dataSourceInfo[source].displayName}:{" "}
          </span>
          <span class="font-mono">{params.search}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TitleElement />
      <div style={{ display: "grid", "grid-template-columns": "1fr 5fr" }}>
        <Switch>
          <Match when={searchQuery.isPending}>
            <LoadingSpinner />
          </Match>
          <Match when={searchQuery.isError}>
            <ErrorCard
              errorText={`Could not make search query: ${searchQuery.error.message}`}
            />
          </Match>
          <Match when={searchQuery.isSuccess}>
            <SubclassSelect subclasses={searchQuery.data} />
          </Match>
        </Switch>
        <div>
          <PlotOptions />
          <DatapointDisplay />
        </div>
      </div>
    </div>
  );
}
