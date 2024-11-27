import { For } from "solid-js";
import { Card } from "./ui/card";
import { TMetadata } from "~/lib/metadata";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoHappyOutline, IoSadOutline } from "solid-icons/io";
import { CgSmileNeutral } from "solid-icons/cg";
import { useService } from "solid-services";
import { SubclassFilterService } from "~/lib/subclassFilter";
import { Button } from "./ui/button";
import { ImSpotify } from "solid-icons/im";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { parseArgs } from "util";

export function DatapointDisplay(props: { metadata: TMetadata }) {
  const subclassFilter = useService(SubclassFilterService);
  const m = props.metadata;

  function doesMatchFilter(idx: string): boolean {
    const createdDate = new Date(m.created_utc[idx]);
    if (
      subclassFilter().subclassFilter.begDate !== null &&
      subclassFilter().subclassFilter.endDate !== null
    ) {
      return (
        createdDate >= subclassFilter().subclassFilter.begDate &&
        createdDate <= subclassFilter().subclassFilter.endDate
      );
    }
    return true;
  }

  function navigateToLink(url: string) {
    console.log(url);
    window.open(url);
  }

  function infoDisplay(idx: string) {
    const jsonString = (m.all_links[idx] as string).replaceAll("'", `"`);
    const linkList = JSON.parse(jsonString) as string[];
    return (
      <Card class="ml-10 p-3">
        <div>
          <div>
            <For each={linkList}>
              {(linkURL) => {
                return (
                  <div>
                    <Button
                      variant="link"
                      onClick={() => navigateToLink(linkURL)}
                    >
                      {linkURL}
                    </Button>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Card>
    );
  }

  function DatapointTile(idx: string) {
    function getBody() {
      if (`${m.body[idx]}` == "NaN")
        return <div class="italic">No Body Text</div>;
      else return <div>{m.body[idx]}</div>;
    }

    function getSentiment() {
      const sentiment = m.sentiment[idx];
      switch (sentiment) {
        case "positive":
          return <IoHappyOutline class="text-green-500" />;
        case "negative":
          return <IoSadOutline class="text-red-500" />;
        case "neutral":
          return <CgSmileNeutral class="text-yellow-500" />;
      }
    }

    function separator() {
      return (
        <div class="flex py-2">
          <div class={`min-w-3`} />
          <div class="border-r-2" />
          <div class={`min-w-3`} />
        </div>
      );
    }

    return (
      <Collapsible>
        <CollapsibleTrigger class="text-left w-full ">
          <div
            class="shadow-none hover:shadow-md  p-2 hover:bg-secondary rounded"
            onClick={() => {}}
          >
            <div class="flex align-middle">
              <div class="text-xl self-center">{idx}</div>
              {separator()}
              <div class="flex-grow">
                <div class="text-info text-xs">
                  Posted to r/{m.subreddit[idx]} on {m.created_utc[idx]}
                </div>
                <div class="font-bold text-lg">{m.title[idx]}</div>
                <div class="text-sm text-muted-foreground line-clamp-1 text-ellipsis">
                  {getBody()}
                </div>
              </div>
              {/* <div class="self-center mr-3">
            <Button
              variant="secondary"
              onClick={() => navigateToLink(m.spotify_links[idx])}
            >
              <ImSpotify />
            </Button>
          </div> */}
              <div class="text-2xl self-center">
                <Tooltip>
                  <TooltipTrigger>
                    <div>{getSentiment()}</div>
                  </TooltipTrigger>
                  <TooltipContent>Sentiment</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>{infoDisplay(idx)}</CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Card class="m-2 p-2">
      <div class="divide-y">
        <For each={Object.keys(props.metadata.title)}>
          {(val) => {
            if (doesMatchFilter(val)) {
              return DatapointTile(val);
            } else {
              return <div />;
            }
          }}
        </For>
      </div>
    </Card>
  );
}
