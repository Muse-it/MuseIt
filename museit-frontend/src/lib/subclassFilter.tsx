import { createSignal } from "solid-js";

export type Subclass = [string, number];

export type SubclassFilter = {
  begDate: Date | null;
  endDate: Date | null;
  subclasses: string[];
  withComments: boolean;
  onlyScraping: boolean;
  withSpotdlScraping: boolean;
  // Don't use this directly! Use derivedCommentsInSpotdl instead (LATER: make it private, if possible?)
  commentsInSpotdl: boolean;
};

const initialSubclassFilter: SubclassFilter = {
  begDate: null,
  endDate: null,
  subclasses: [],
  withComments: false,
  onlyScraping: false,
  withSpotdlScraping: false,
  commentsInSpotdl: false,
};

export function formatDate(d: Date | null) {
  if (d === null) {
    return "yyyy-mm-dd";
  }
  return d.toISOString().substring(0, 10);
}

export function SubclassFilterService() {
  const [getSubclassFilter, setSubclassFilter] = createSignal<SubclassFilter>(
    initialSubclassFilter
  );

  return {
    get subclassFilter() {
      return getSubclassFilter();
    },

    get derivedCommentsInSpotdl() {
      const sf = getSubclassFilter();
      return (sf.withComments && sf.withSpotdlScraping) ? sf.commentsInSpotdl : false;
    },

    toggleSubclass(subc: string) {
      let newList = getSubclassFilter().subclasses;
      if (newList.includes(subc)) {
        let delIdx = newList.findIndex((val) => val === subc);
        console.log("deleted:", newList.splice(delIdx, 1));
      } else {
        newList.push(subc);
      }
      setSubclassFilter({ ...getSubclassFilter(), subclasses: newList });
    },

    toggleAll(allSubclasses: string[]) {
      const currentList = getSubclassFilter();
      if (currentList.subclasses.length === allSubclasses.length) {
        setSubclassFilter({ ...getSubclassFilter(), subclasses: [] });
      } else {
        setSubclassFilter({
          ...getSubclassFilter(),
          subclasses: allSubclasses,
        });
      }
    },

    setWithComments(newBool: boolean) {
      setSubclassFilter({...getSubclassFilter(), withComments: newBool});
    },
    setOnlyScraping(newBool: boolean) {
      setSubclassFilter({...getSubclassFilter(), onlyScraping: newBool});
    },
    setWithSpotdlScraping(newBool: boolean) {
      setSubclassFilter({...getSubclassFilter(), withSpotdlScraping: newBool});
    },
    setCommentsInSpotdl(newBool: boolean) {
      setSubclassFilter({...getSubclassFilter(), commentsInSpotdl: newBool});
    },
    setBegDate(newDate: Date) {
      setSubclassFilter({ ...getSubclassFilter(), begDate: newDate });
    },
    setEndDate(newDate: Date) {
      setSubclassFilter({ ...getSubclassFilter(), endDate: newDate });
    },
    setSubclassesList(newList: string[]) {
      setSubclassFilter({ ...getSubclassFilter(), subclasses: newList });
    },
  };
}
