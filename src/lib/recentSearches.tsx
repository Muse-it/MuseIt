import { createWithSignal } from "solid-zustand";

type RecentSearchList = string[];

const recentSearchesStorageKey = "museItRecentSearches";
function getRecentSearchesFromLocalStorage() {
  return localStorage.getItem(recentSearchesStorageKey)
    ? (JSON.parse(
        localStorage.getItem(recentSearchesStorageKey)
      ) as RecentSearchList)
    : ([] as RecentSearchList);
}
function setRecentSearchesInLocalStorage(rSearches: RecentSearchList) {
  localStorage.setItem(recentSearchesStorageKey, JSON.stringify(rSearches));
}

interface RecentSearchesState {
  rSearches: RecentSearchList;
  addRSearch: (newSearch: string) => void;
  clearRSearches: () => void;
}

const initialRecentSearches = getRecentSearchesFromLocalStorage();

export const recentSearchesStore = createWithSignal<RecentSearchesState>(
  (set) =>
    ({
      // Recent Searches State
      rSearches: initialRecentSearches,
      addRSearch: (newSearch) =>
        set((state) => {
          const newState = { rSearches: [...state.rSearches, newSearch] };
          setRecentSearchesInLocalStorage(newState.rSearches);
          return newState;
        }),
      clearRSearches: () =>
        set((state) => {
          const newState = { rSearches: [] };
          setRecentSearchesInLocalStorage(newState.rSearches);
          return newState;
        }),
    } as RecentSearchesState)
);
