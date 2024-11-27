import { Card } from "./ui/card";
import { Subclass, SubclassFilterService } from "~/lib/subclassFilter";
import { useService } from "solid-services";
import { TextField, TextFieldInput } from "./ui/text-field";
import { Button } from "./ui/button";
import { TbSelectAll } from "solid-icons/tb";

function formatForDateInput(d: Date | null) {
  if (d === null) {
    return "yyyy-mm-dd";
  }
  return d.toISOString().substring(0, 10);
}

export function SubclassSelect(props: {
  allSubclasses: Subclass[];
  triggerRefetch: () => void;
}) {
  const subclassFilterService = useService(SubclassFilterService);
  // const [startDate, setStartDate] = createSignal(
  //   new Date(Date.now()).toISOString()
  // );
  // const [endDate, setEndDate] = createSignal(
  //   new Date(Date.now()).toISOString()
  // );

  function selectAllSubclasses() {
    const allSubclassNames = props.allSubclasses.map((s) => s[0]);
    subclassFilterService().toggleAll(allSubclassNames);
  }

  return (
    <div>
      <Card class="flex flex-col m-2 p-2">
        {/* 
          Submit
        */}
        <div class="flex m-3">
          <Button
            variant="secondary"
            // flashButton class added in src/index.css at @layer components
            class="flex-grow flashButton shadow-secondary-foreground"
            onClick={props.triggerRefetch}
          >
            Submit Filter
          </Button>
        </div>

        {/* 
          Time Control
        */}
        <div>
          <div class="m-1 p-1 shadow-none">
            <span>Start at: </span>
            <TextField>
              <TextFieldInput
                type="date"
                value={formatForDateInput(
                  subclassFilterService().subclassFilter.begDate
                )}
                onInput={(e) => {
                  console.log(e.currentTarget.value);
                  subclassFilterService().setBegDate(
                    new Date(e.currentTarget.value)
                  );
                }}
              />
            </TextField>
            <span>End at: </span>
            <TextField>
              <TextFieldInput
                type="date"
                value={formatForDateInput(
                  subclassFilterService().subclassFilter.endDate
                )}
                onInput={(e) => {
                  subclassFilterService().setEndDate(
                    new Date(e.currentTarget.value)
                  );
                }}
              />
            </TextField>
          </div>
        </div>
        <br />

        {/* 
          Subclasses
        */}
        <div>
          <div class="mx-2">
            <hr />
            <br />
            <div class="flex">
              <div class="flex-grow">
                <h2 class="text-xl font-bold">Subclasses:</h2>
                <div class="text-muted-foreground font-light text-xs">
                  Click the number to toggle
                </div>
              </div>
              <Button
                variant="ghost"
                class="p-1 px-3 text-xl"
                onClick={selectAllSubclasses}
              >
                <TbSelectAll />
              </Button>
            </div>
          </div>
          {props.allSubclasses.map((subc) => {
            const isSelected =
              subclassFilterService().subclassFilter.subclasses.includes(
                subc[0]
              );
            return (
              <div>
                <div class="m-1 p-1 flex place-items-center">
                  <div class="flex-grow">{subc[0]}</div>
                  <button
                    onClick={() =>
                      subclassFilterService().toggleSubclass(subc[0])
                    }
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
