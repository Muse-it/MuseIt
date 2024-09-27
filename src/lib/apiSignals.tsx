import { createQuery } from "@tanstack/solid-query";
import { DataSource } from "./dataSource";
import { mockMetadata, mockSearch } from "./mockData";

const hours24inMs = 1000 * 60 * 60 * 24;
const baseUrl = "";
const mockDelayMs = 3000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// these abstract classes never instantiated, they're only used to encapsulate api details and methods.

abstract class RedditClient {
  static async makeSearchQuery(searchText: string) {
    const result = await fetch(`${baseUrl}/query/${searchText}`);
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.json();
  }
}

abstract class MockClient {
  static async makeSearchQuery(searchText: string) {
    await delay(mockDelayMs);
    const result = mockSearch;
    return result;
  }
}

export function createSearchQuery(source: DataSource, searchText: string) {
  console.log("searchquerykey: " + `${source}_${searchText}_search`);
  function chooseClient(): Promise<any> {
    switch (source) {
      case "reddit":
        return RedditClient.makeSearchQuery(searchText);
      case "mock":
        return MockClient.makeSearchQuery(searchText);
      default:
        return source satisfies never;
    }
  }

  const searchQuery = createQuery(() => ({
    queryKey: [`${source}_${searchText}_search`],
    queryFn: () => chooseClient(),
    staleTime: hours24inMs,
    throwOnError: true, // Throw an error if the query fails
  }));

  return searchQuery;
}
