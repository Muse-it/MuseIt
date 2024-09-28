import { Card } from "./ui/card";
import { Subclass, SubclassFilterService } from "~/lib/subclassFilter";
import { useService } from "solid-services";

export function SubclassSelect(props: { subclasses: Subclass[] }) {
  const subclassFilterService = useService(SubclassFilterService);

  function onClickSubclass(subclass: string) {
    subclassFilterService().toggleSubclass(subclass);
  }

  return (
    <div>
      <Card class="flex flex-col m-2 p-2">
        <div>Time Control</div>
        <div>
          {props.subclasses.map((subc) => {
            const isSelected =
              subclassFilterService().subclassFilter.subclasses.includes(
                subc[0]
              );
            return (
              <div>
                <div class="m-1 p-1 flex place-items-center">
                  <div class="flex-grow">{subc[0]}</div>
                  <button
                    onClick={() => onClickSubclass(subc[0])}
                    class={"ml-2 p-2 rounded-md transition-colors duration-300"}
                    classList={{
                      "bg-error-foreground/40": !isSelected,
                      "bg-success-foreground/40": isSelected,
                    }}
                  >
                    {subc[1]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
