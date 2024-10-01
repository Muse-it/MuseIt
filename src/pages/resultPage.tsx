import { useParams } from "@solidjs/router";
import { Match, Switch, createEffect, createSignal } from "solid-js";
import { useService } from "solid-services";
import { DatapointDisplay } from "~/components/datapointsDisplay";
import ErrorCard from "~/components/errorCard";
import LoadingSpinner from "~/components/loadingSpinner";
import { PlotOptions } from "~/components/plotOptions";
import { SubclassSelect } from "~/components/subclassSelect";
import { createGenerateQuery, createSearchQuery } from "~/lib/apiSignals";
import { DataSource, dataSourceInfo } from "~/lib/dataSource";
import { SubclassFilterService } from "~/lib/subclassFilter";

export default function ResultPage() {
  const params = useParams();
  const source = params.source as DataSource;
  const searchText = params.search as string;

  const subclassFilter = useService(SubclassFilterService);

  const searchQuery = createSearchQuery(source, searchText);
  const genQuery = createGenerateQuery(source, subclassFilter().subclassFilter);

  function doRefetch() {
    genQuery.refetch();
    console.log(genQuery.status);
  }

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
        {/* Subclass Filter */}
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
            <SubclassSelect
              allSubclasses={searchQuery.data}
              triggerRefetch={doRefetch}
            />
          </Match>
        </Switch>

        {/* Generated Data */}
        <Switch>
          <Match when={genQuery.isPending}>
            <div class="mt-10 flex justify-center">
              <div class="text-2xl">Submit a filter to start generating.</div>
            </div>
          </Match>
          <Match when={genQuery.isFetching}>
            <div class="flex flex-col justify-start mt-10 align-middle place-items-center">
              <div class="my-5">Running...</div>
              <LoadingSpinner />
            </div>
          </Match>
          <Match when={genQuery.isError}>
            <ErrorCard
              errorText={`Could not make search query: ${searchQuery.error.message}`}
            />
          </Match>
          <Match when={genQuery.isSuccess}>
            <div>
              <PlotOptions
                source={source}
                metadata={genQuery.data}
                search={searchText}
              />
              <DatapointDisplay metadata={genQuery.data} />
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
