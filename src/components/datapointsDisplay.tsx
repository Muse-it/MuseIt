import { For } from "solid-js";
import { Card } from "./ui/card";
import { TMetadata } from "~/lib/metadata";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IoHappyOutline, IoSadOutline } from "solid-icons/io";
import { CgSmileNeutral } from "solid-icons/cg";

export function DatapointDisplay(props: { metadata: TMetadata }) {
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

    const m = props.metadata;
    return (
      <div class="shadow-none hover:shadow-md m-1 p-2 border-b-2 ">
        <div class="flex align-middle">
          <div class="text-xl self-center">{idx}</div>
          {separator()}
          <div class="flex-grow">
            <div class="font-bold text-lg">{m.title[idx]}</div>
            <div class="text-sm text-muted-foreground line-clamp-1 text-ellipsis">
              {getBody()}
            </div>
          </div>
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
    );
  }

  return (
    <Card class="m-2 p-2">
      <div>
        <For each={Object.values(Object.keys(props.metadata.title))}>
          {(val) => DatapointTile(val)}
        </For>
      </div>
    </Card>
  );
}
