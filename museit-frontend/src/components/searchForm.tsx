import { Button } from "./ui/button";
import { Signal, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
} from "./ui/text-field";
import { DataSource, dataSourceInfo } from "~/lib/dataSource";
import { RecentSearchesService } from "~/lib/recentSearches";
import { useService } from "solid-services";
import { SubclassFilterService } from "~/lib/subclassFilter";

function SearchButton(props: {
  source: DataSource;
  onClick: (e: Event) => void;
}) {
  return (
    <div class="flex justify-center">
      <Button
        onclick={props.onClick}
        class="hover:bg-accent hover:text-accent-foreground rounded-full text-xl mx-4 my-1 px-7 py-6"
      >
        Search with {dataSourceInfo[props.source].displayName}
        <span class="ml-2 text-3xl">
          {dataSourceInfo[props.source].icon({})}
        </span>
      </Button>
    </div>
  );
}

export default function SearchForm(props: { searchSignal: Signal<string> }) {
  const [searchVal, setSearchVal] = props.searchSignal;
  const navigate = useNavigate();
  // const rSearches = useStore(recentSearches);
  const recentSearchesService = useService(RecentSearchesService);
  const subclassFilterService = useService(SubclassFilterService);

  function doSearch(source: DataSource) {
    if (inputIsInvalid()) return;
    subclassFilterService().setSubclassesList([]);
    recentSearchesService().addRSearch(searchVal());
    navigate(`/result/${source}/${searchVal()}`);
  }

  function inputIsInvalid() {
    // TODO: only allow valid filenames (disallow special characters entirely??)
    return searchVal() === null || searchVal().length <= 0;
  }

  return (
    <div class="flex justify-center">
      <div class="mt-20">
        <form>
          <div class="mb-8">
            <TextField validationState={inputIsInvalid() ? "invalid" : "valid"}>
              <TextFieldInput
                type="search"
                class="outline-none rounded-lg border-2 bg-transparent text-2xl p-3"
                value={searchVal()}
                onInput={(e) => setSearchVal(e.currentTarget.value)}
              />
              <TextFieldErrorMessage class="mt-2 mb-3">
                Search field is empty
              </TextFieldErrorMessage>
            </TextField>
          </div>
          <SearchButton source={"reddit"} onClick={() => doSearch("reddit")} />
          {/* <SearchButton source={"mock"} onClick={() => doSearch("mock")} /> */}
        </form>
      </div>
    </div>
  );
}
