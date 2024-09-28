import { createSignal } from "solid-js";

export type Subclass = [string, number];

export type SubclassFilter = {
  begTimeUTC: string;
  endTimeUTC: string;
  subclasses: string[];
};

const initialSubclassFilter: SubclassFilter = {
  begTimeUTC: null,
  endTimeUTC: null,
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
  };
}
