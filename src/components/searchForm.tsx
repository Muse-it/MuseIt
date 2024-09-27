import { TextField } from "@kobalte/core/text-field";
import { Button } from "./ui/button";
import { AiOutlineReddit } from "solid-icons/ai";
import { createSignal } from "solid-js";
import { recentSearchesStore } from "~/lib/recentSearches";
import { useNavigate } from "@solidjs/router";
import { TextFieldErrorMessage } from "./ui/text-field";
import { DataSource, dataSourceInfo } from "~/lib/dataSource";

function SearchButton(props: {
  source: DataSource;
  onClick: (e: Event) => void;
}) {
  return (
    <div class="flex justify-center">
      <Button
        onclick={props.onClick}
        class="hover:bg-accent hover:text-accent-foreground rounded-full text-xl m-4 px-7 py-6"
      >
        Search with {dataSourceInfo[props.source].displayName}
        <span class="ml-2 text-3xl">
          {dataSourceInfo[props.source].icon({})}
        </span>
      </Button>
    </div>
  );
}

export default function SearchForm() {
  const addRSearch = recentSearchesStore((s) => s.addRSearch);
  const [searchVal, setSearchVal] = createSignal<string>(null);
  const navigate = useNavigate();
  let inputField: any;

  function doSearch(source: DataSource) {
    if (inputIsInvalid()) return;
    addRSearch(searchVal());
    navigate(`/result/${source}/${searchVal()}`);
  }

  function inputIsInvalid() {
    return searchVal() === null || searchVal().length <= 0;
  }

  return (
    <div class="flex justify-center items-center">
      <div class="flex flex-col items-center">
        <form>
          <div>
            <TextField validationState={inputIsInvalid() ? "invalid" : "valid"}>
              <TextField.Input
                ref={inputField}
                type="search"
                class="outline-none rounded-lg border-2 bg-transparent text-2xl p-3"
                value={searchVal()}
                onChange={(e) => setSearchVal(e.currentTarget.value)}
              />
              <TextFieldErrorMessage class="mt-2 mb-3">
                Search field is empty
              </TextFieldErrorMessage>
            </TextField>
          </div>
          <SearchButton source={"reddit"} onClick={() => doSearch("reddit")} />
          <SearchButton source={"mock"} onClick={() => doSearch("mock")} />
        </form>
      </div>
    </div>
  );
}
