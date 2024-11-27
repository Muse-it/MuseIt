import { createSignal } from "solid-js";

export type Subclass = [string, number];

export type SubclassFilter = {
  begDate: Date | null;
  endDate: Date | null;
  subclasses: string[];
};

const initialSubclassFilter: SubclassFilter = {
  begDate: null,
  endDate: null,
  subclasses: [],
};

export function SubclassFilterService() {
  const [getSubclassFilter, setSubclassFilter] = createSignal<SubclassFilter>(
    initialSubclassFilter
  );

  return {
    get subclassFilter() {
      return getSubclassFilter();
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

    setBegDate(newDate: Date) {
      setSubclassFilter({ ...getSubclassFilter(), begDate: newDate });
    },
    setEndDate(newDate: Date) {
      setSubclassFilter({ ...getSubclassFilter(), endDate: newDate });
    },
  };
}
