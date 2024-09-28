import { createQuery } from "@tanstack/solid-query";
import { DataSource } from "./dataSource";
import { mockMetadata, mockSearch } from "./mockData";
import { SubclassFilter } from "./subclassFilter";

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
  static async makeGenerateQuery(subclassFilter: SubclassFilter) {
    const result = await fetch(`${baseUrl}/generate`);
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
  static async makeGenerateQuery(subclassFilter: SubclassFilter) {
    console.log();
    await delay(mockDelayMs);
    const result = mockMetadata;
    return result;
  }
}

export function createSearchQuery(source: DataSource, searchText: string) {
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
  }));

  return searchQuery;
}

export function createGenerateQuery(
  source: DataSource,
  subclassFilter: SubclassFilter
) {
  console.log(`${source}_${JSON.stringify(subclassFilter)}_generate`);
  function chooseClient(): Promise<any> {
    switch (source) {
      case "reddit":
        return RedditClient.makeGenerateQuery(subclassFilter);
      case "mock":
        return MockClient.makeGenerateQuery(subclassFilter);
      default:
        return source satisfies never;
    }
  }

  const genQuery = createQuery(() => ({
    queryKey: [`${source}_${subclassFilter}_generate`],
    queryFn: () => chooseClient(),
    staleTime: hours24inMs,
    enabled: subclassFilter.subclasses.length > 0,
  }));

  return genQuery;
}
