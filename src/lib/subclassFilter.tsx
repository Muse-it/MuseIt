import { createWithSignal } from "solid-zustand";

export type Subclass = [string, number];

export type SubclassFilter = {
  begTimeUTC: string;
  endTimeUTC: string;
  subclasses: string[];
};

interface SubclassFilterState {
  subclassFilter: SubclassFilter;
  setBegTime: (newTime: string) => void;
  setEndTime: (newTime: string) => void;
  toggleSubclass: (toggledSubclass: string) => void;
}

const initialSubclassFilter = {
  begTimeUTC: null,
  endTimeUTC: null,
  subclasses: [],
};
export const subclassFilterStore = createWithSignal<SubclassFilterState>(
  (set) =>
    ({
      // Recent Searches State
      subclassFilter: initialSubclassFilter,
      setBegTime: (newTime) =>
        set((state) => ({
          subclassFilter: {
            ...state.subclassFilter,
            begTimeUTC: newTime,
          },
        })),
      setEndTime: (newTime) =>
        set((state) => ({
          subclassFilter: {
            ...state.subclassFilter,
            endTimeUTC: newTime,
          },
        })),
      toggleSubclass: (toggledSubclass) =>
        set((state) => {
          let newSubclasses = state.subclassFilter.subclasses;
          if (newSubclasses.includes(toggledSubclass)) {
            let delIdx = newSubclasses.findIndex(
              (val) => val === toggledSubclass
            );
            newSubclasses.splice(delIdx, 1);
          } else {
            newSubclasses.push(toggledSubclass);
          }
          return {
            subclassFilter: {
              ...state.subclassFilter,
              subclasses: newSubclasses,
            },
          };
        }),
    } as SubclassFilterState)
);
