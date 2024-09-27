import { For } from "solid-js";
import { Card } from "./ui/card";
import { Subclass, subclassFilterStore } from "~/lib/subclassFilter";

function SubclassTile(props: {
  subclass: Subclass;
  isSelected: boolean;
  toggleSubclass: () => void;
}) {
  const colorPalette = props.isSelected ? "success" : "error";

  return (
    <div class="m-1 p-1 flex place-items-center">
      <div class="flex-grow">{props.subclass[0]}</div>
      <button
        onClick={() => props.toggleSubclass()}
        class={` ml-2 p-2 rounded-md bg-${colorPalette}-foreground/35 hover:bg-${colorPalette}-foreground/75 transition-colors duration-300`}
      >
        {props.subclass[1]}
      </button>
    </div>
  );
}

export function SubclassSelect(props: { subclasses: Subclass[] }) {
  const subclassFilter = subclassFilterStore((s) => s.subclassFilter);
  const toggleSubclass = subclassFilterStore((s) => s.toggleSubclass);

  return (
    <div>
      <Card class="flex flex-col m-2 p-2">
        <div>Time Control</div>
        <div>
          <For each={props.subclasses}>
            {(subc) => (
              <SubclassTile
                subclass={subc}
                isSelected={subclassFilter().subclasses.includes(subc[0])}
                toggleSubclass={() => toggleSubclass(subc[0])}
              />
            )}
          </For>
        </div>
      </Card>
    </div>
  );
}
