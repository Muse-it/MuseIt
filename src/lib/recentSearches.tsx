import { createSignal } from "solid-js";
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
const initialRecentSearches = getRecentSearchesFromLocalStorage();

export function RecentSearchesService() {
  const [getRecentSearches, setRecentSearches] = createSignal<RecentSearchList>(
    initialRecentSearches
  );

  return {
    get recentSearches() {
      return getRecentSearches();
    },

    addRSearch(newSearch: string) {
      const newState = [...getRecentSearches(), newSearch];
      setRecentSearchesInLocalStorage(newState);
      setRecentSearches(newState);
    },

    clearRSearches() {
      const newState = [];
      setRecentSearchesInLocalStorage(newState);
      setRecentSearches(newState);
    },
  };
}
