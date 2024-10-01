import { createQuery } from "@tanstack/solid-query";
import { DataSource } from "./dataSource";
import { mockMetadata, mockSearch } from "./mockData";
import { SubclassFilter } from "./subclassFilter";

const hours24inMs = 1000 * 60 * 60 * 24;
const baseUrl = "http://localhost:5000";
const mockDelayMs = 1000;

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
  static async makePlotQuery(filename: string, query: string) {
    console.log("fetching", `${baseUrl}/plots/${query}/${filename}`);
    const result = await fetch(`${baseUrl}/plots/${query}/${filename}`);
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.text();
  }
  static getPlotURL(filename: string, query: string) {
    return `${baseUrl}/plots/${query}/${filename}`;
  }
}

abstract class MockClient {
  static async makeSearchQuery(searchText: string) {
    await delay(mockDelayMs);
    const result = mockSearch;
    return result;
  }
  static async makeGenerateQuery(subclassFilter: SubclassFilter) {
    await delay(mockDelayMs);
    const result = mockMetadata;
    return result;
  }
  static async makePlotQuery(filename: string, query: string) {
    console.log("fetching", `${baseUrl}/plots/${query}/${filename}`);
    const result = await fetch(
      `${baseUrl}/plots/${"Depression Music"}/${filename}`,
      {
        mode: "no-cors",
      }
    );
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.text();
  }
  static getPlotURL(filename: string, query: string) {
    return `${baseUrl}/plots/${"Depression Music"}/${filename}`;
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

export function createPlotQuery(
  source: DataSource,
  filename: string,
  query: string
) {
  console.log(filename);
  function chooseClient(): Promise<any> {
    switch (source) {
      case "reddit":
        return RedditClient.makePlotQuery(filename, query);
      case "mock":
        return MockClient.makePlotQuery(filename, query);
      default:
        return source satisfies never;
    }
  }

  const plotQuery = createQuery(() => ({
    queryKey: [`${source}_${filename}_${query}_plot`],
    queryFn: () => chooseClient(),
    staleTime: hours24inMs,
  }));

  return plotQuery;
}

export function navigateToPlot(
  source: DataSource,
  filename: string,
  query: string
) {
  let plotURL: string;
  switch (source) {
    case "reddit":
      plotURL = RedditClient.getPlotURL(filename, query);
      break;
    case "mock":
      plotURL = MockClient.getPlotURL(filename, query);
      break;
    default:
      return source satisfies never;
  }
  window.open(
    plotURL,
    "_blank",
    "location=yes,height=500,width=570,scrollbars=yes,status=yes"
  );
}
