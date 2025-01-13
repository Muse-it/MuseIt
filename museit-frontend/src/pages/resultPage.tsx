import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Match, Switch, createSignal } from "solid-js";
import { useService } from "solid-services";
import { DatapointDisplay } from "~/components/datapointsDisplay";
import ErrorCard from "~/components/errorCard";
import LoadingSpinner from "~/components/loadingSpinner";
import { PlotOptions } from "~/components/plotOptions";
import { SubclassSelect } from "~/components/subclassSelect";
import { chooseClient, hours24inMs } from "~/lib/apiSignals";
import { DataSource, dataSourceInfo } from "~/lib/dataSource";
import { SubclassFilterService } from "~/lib/subclassFilter";

export default function ResultPage() {
  const params = useParams();
  const source = params.source as DataSource;
  const searchText = decodeURIComponent(params.search as string);

  const subclassFilter = useService(SubclassFilterService);
  const [isGenEnabled, setIsGenEnabled] = createSignal(false);

  const searchQuery = createQuery(() => ({
    queryKey: [`${source}_${searchText}_search`],
    queryFn: () => chooseClient(source).makeSearchQuery(searchText),
    staleTime: hours24inMs,
  }));
  const genQuery = createQuery(() => ({
    queryKey: [`${source}_${searchText}_${subclassFilter}_generate`],
    queryFn: () =>
      chooseClient(source).makeGenerateQuery(
        subclassFilter().subclassFilter,
        searchText
      ),
    staleTime: hours24inMs,
    enabled: isGenEnabled(),
    // placeholderData: null,
    retry: false,
    retryOnMount: false,
    refetchInterval: hours24inMs,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  }));

  function doRefetch() {
    if (isGenEnabled()) {
      genQuery.refetch();
    } else {
      setIsGenEnabled(true);
    }
    console.log(genQuery.fetchStatus);
    console.log(genQuery.status);
  }

  function TitleElement() {
    return (
      <div class="m-2 mt-4 p-2 shadow-none">
        <div class="text-xl">
          <span class="text-muted-foreground">
            Searching with {dataSourceInfo[source].displayName}:{" "}
          </span>
          <span class="font-mono">{searchText}</span>
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
          <Match when={genQuery.isFetching}>
            <GenerateSpinner />
          </Match>
          <Match when={genQuery.isPending}>
            <div class="mt-10 flex justify-center">
              <div class="text-2xl">Submit a filter to start generating.</div>
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

export const GenerateSpinner = () => (
  <div class="flex flex-col mt-10 align-middle place-items-center">
    <LoadingSpinner />
    <p class="mt-5">Running query...</p>
    <p>
      This may take a while. Open the backend console to monitor query progress.
    </p>
    <p class="text-xs mt-3">
      If the required models are not cached then the backend should start a
      download as well
    </p>
  </div>
);
