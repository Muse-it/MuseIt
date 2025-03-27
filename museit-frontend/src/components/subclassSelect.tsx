import { Card } from "./ui/card";
import {
  Subclass,
  SubclassFilterService,
  formatDate,
} from "~/lib/subclassFilter";
import { useService } from "solid-services";
import { TextField, TextFieldInput } from "./ui/text-field";
import { Button } from "./ui/button";
import { TbSelectAll } from "solid-icons/tb";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/lablel";

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
  function submitFilter() {
    if (subclassFilterService().subclassFilter.subclasses.length <= 0) {
      alert("Subclass list is empty!");
      return;
    }
    props.triggerRefetch();
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
            onClick={submitFilter}
          >
            Submit Filter
          </Button>
        </div>

        {/* 
          Time Control
        */}
        <div class="mb-5">
          <div class="m-1 p-1 shadow-none">
            <span>Start at: </span>
            <p class="text-xs italic">defaults to one year before End Date</p>
            <TextField>
              <TextFieldInput
                type="date"
                value={formatDate(
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
            <p class="text-xs italic">defaults to today</p>
            <TextField>
              <TextFieldInput
                type="date"
                value={formatDate(
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

        {/* 
          Checkboxes
        */}
        <div class="flex items-center space-x-2 mb-5">
          <Checkbox checked={subclassFilterService().subclassFilter.withComments} onClick={() => {subclassFilterService().setWithComments(!subclassFilterService().subclassFilter.withComments)}}/>
          <div class="grid gap-1.5 leading-none">
            <Label for="terms1-input">Include comments?</Label>
            <p class="text-xs">
              Enable if comments are to be included in NLP analysis; <span class="text-error-foreground">Will cause the query to take much longer</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 mb-5">
          <Checkbox checked={subclassFilterService().subclassFilter.onlyScraping} onClick={() => {subclassFilterService().setOnlyScraping(!subclassFilterService().subclassFilter.onlyScraping)}}/>
          <div class="grid gap-1.5 leading-none">
            <Label for="terms1-input">Only scraping?</Label>
            <p class="text-xs">
              Ticking this will skip modelling and analysis tasks and only give scraping results.
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 mb-5">
          <Checkbox checked={subclassFilterService().subclassFilter.withSpotdlScraping} onClick={() => {subclassFilterService().setWithSpotdlScraping(!subclassFilterService().subclassFilter.withSpotdlScraping)}}/>
          <div class="grid gap-1.5 leading-none">
            <Label for="terms1-input">Run spotDL Scraping?</Label>
            <p class="text-xs">
              Will generate spotdl data files for each spotify URI that was found (Only artists, albums and playlists). Files will be present in the backend executable directory.
            </p>
          </div>
        </div>

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
