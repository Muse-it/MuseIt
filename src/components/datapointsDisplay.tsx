import { For } from "solid-js";
import { Card } from "./ui/card";

export function DatapointDisplay() {
  const mockLIst = [...Array(60).keys()];
  const color = 0xaaaaaa;

  return (
    <Card class="m-2 p-2">
      <div>
        <For each={mockLIst}>{(i) => <div>Datapoint {i + 1}</div>}</For>
      </div>
    </Card>
  );
}
