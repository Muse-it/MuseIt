import { For, Match, Switch } from "solid-js";
import { Card } from "./ui/card";
import { TMetadata } from "~/lib/metadata";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoHappyOutline, IoSadOutline } from "solid-icons/io";
import { CgSmileNeutral } from "solid-icons/cg";
import { useService } from "solid-services";
import { SubclassFilterService } from "~/lib/subclassFilter";
import { Button } from "./ui/button";
import { ImSpotify } from "solid-icons/im";
import { ImReddit } from "solid-icons/im";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useParams } from "@solidjs/router";
import { DataSource } from "~/lib/dataSource";
import { GenerateSpinner } from "~/pages/resultPage";

export function DatapointDisplay(props: { metadata: TMetadata }) {
  const subclassFilter = useService(SubclassFilterService);
  const m = props.metadata;
  const params = useParams();
  const dataSource = params.source as DataSource;
  function doesMatchFilter(idx: string): boolean {
    let doesMatchDate: boolean = true;
    const createdDate = new Date(m.created_utc[idx]);
    if (
      subclassFilter().subclassFilter.begDate !== null &&
      subclassFilter().subclassFilter.endDate !== null
    ) {
      doesMatchDate =
        createdDate >= subclassFilter().subclassFilter.begDate &&
        createdDate <= subclassFilter().subclassFilter.endDate;
    }

    let doesMatchSubclass: boolean = true;
    const subcs = subclassFilter().subclassFilter.subclasses;
    if (subcs.length > 0) {
      if (dataSource == "reddit") {
        if (!subcs.includes(m.subreddit[idx])) {
          doesMatchSubclass = false;
        }
      }
    }

    return doesMatchDate && doesMatchSubclass;
  }

  function navigateToLink(url: string) {
    console.log(url);
    window.open(url);
  }
  function getBody(idx: number | string) {
    if (`${m.body[idx]}` == "NaN")
      return <div class="italic">No Body Text</div>;
    else return <div>{m.body[idx]}</div>;
  }

  function infoDisplay(idx: string) {
    function infoDisplayHeading(text: string) {
      return <p class="text-xl font-bold">{text}</p>;
    }

    function infoLine(key: string, text: string) {
      return (
        <div class="flex">
          <p class="italic">{key}</p>
          <p>{`: ${text}`}</p>
        </div>
      );
    }

    function linkRow(linkURL: string) {
      return (
        <div class="flex place-items-center">
          <Switch fallback={<div />}>
            <Match when={linkURL.search("reddit.com") != -1}>
              <ImReddit class="text-reddit" />
            </Match>
            <Match when={linkURL.search("spotify.com") != -1}>
              <ImSpotify class="text-success-foreground" />
            </Match>
          </Switch>
          <Button variant="link" onClick={() => navigateToLink(linkURL)}>
            {linkURL}
          </Button>
        </div>
      );
    }

    console.log(m);
    console.log(m.all_links[idx]);
    console.log(m.all_links[idx] as string);

    // const jsonString = (m.all_links[idx] as string).replaceAll("'", `"`);
    // const linkList = JSON.parse(jsonString) as string[];
    const linkList = m.all_links[idx] as string[];
    console.log(linkList);
    return (
      <Card class="ml-10 p-3 shadow-none">
        <div>
          <div>
            {infoDisplayHeading("Info: ")}
            {infoLine("Number of comments", m.num_comments[idx])}
            {infoLine("Topics", m.topics[idx])}
            {infoLine("Emotion", m.emotion[idx])}
          </div>
          <div class="mt-5">
            {infoDisplayHeading("All links: ")}
            <For each={linkList}>{linkRow}</For>
          </div>
          <div class="mt-5">
            {infoDisplayHeading("Body: ")}
            <p class="text-muted-foreground">{getBody(idx)}</p>
          </div>
        </div>
      </Card>
    );
  }

  function DatapointTile(idx: string) {
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

    if (props.metadata == null) {
      return <GenerateSpinner />;
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
                  {getBody(idx)}
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
            }
          }}
        </For>
      </div>
    </Card>
  );
}
