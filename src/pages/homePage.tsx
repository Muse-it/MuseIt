import RecentSearchesCard from "~/components/recentSearchesCard";
import SearchForm from "~/components/searchForm";

export default function HomePage() {
  return (
    <div
      class="grid grid-cols-2"
      style={{ "grid-template-columns": "1fr 2fr" }}
    >
      <RecentSearchesCard />
      <SearchForm />
    </div>
  );
}
