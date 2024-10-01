import { createSignal } from "solid-js";
import RecentSearchesCard from "~/components/recentSearchesCard";
import SearchForm from "~/components/searchForm";

export default function HomePage() {
  const searchSignal = createSignal<string>(null);

  return (
    <div
      class="grid grid-cols-2"
      style={{ "grid-template-columns": "1fr 2fr" }}
    >
      <RecentSearchesCard setSearch={searchSignal[1]} />
      <SearchForm searchSignal={searchSignal} />
    </div>
  );
}
