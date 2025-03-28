import { createQuery } from "@tanstack/solid-query";
import { DataSource } from "./dataSource";
import { mockMetadata, mockSearch } from "./mockData";
import { SubclassFilter, formatDate as formatDate } from "./subclassFilter";
import { TMetadata } from "./metadata";

export const hours24inMs = 1000 * 60 * 60 * 24;
const baseUrl = "http://localhost:5000";
const mockDelayMs = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// this interface is used to encapsulate api client details and methods.
// client objects will be of Client type
interface APIClient {
  makeSearchQuery(searchText: string);
  makeGenerateQuery(
    subclassFilter: SubclassFilter,
    query: string
  ): Promise<TMetadata>;
  makePlotQuery(filename: string, query: string);
  getPlotURL(filename: string, query: string);
}

const redditClient: APIClient = {
  async makeSearchQuery(searchText: string) {
    const result = await fetch(`${baseUrl}/query/${searchText}`);
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.json();
  },
  async makeGenerateQuery(subclassFilter: SubclassFilter, query: string) {
    if (subclassFilter.subclasses.length <= 0) {
      throw new Error("No subreddits to search");
    }
    var begDate = subclassFilter.begDate;
    var endDate = subclassFilter.endDate;
    if (endDate == null) {
      endDate = new Date();
    }
    if (begDate == null) {
      begDate = new Date(endDate);
      begDate.setFullYear(begDate.getFullYear() - 1);
    }
    const result = await fetch(`${baseUrl}/generate`, {
      method: "POST",
      body: JSON.stringify({
        query: query,
        list_of_subreddits: subclassFilter.subclasses,
        start_date: formatDate(begDate),
        end_date: formatDate(endDate),
        comments_flag: subclassFilter.withComments,
        metadata_flag: !subclassFilter.onlyScraping,
        spotdl_flag: subclassFilter.withSpotdlScraping,
        spotdl_comments_flag: subclassFilter.commentsInSpotdl,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!result.ok) throw new Error("Failed to fetch data");
    const resultJson = (await result.json()) as TMetadata;
    return resultJson;
  },
  async makePlotQuery(filename: string, query: string) {
    // console.log("fetching", `${baseUrl}/plots/${query}/${filename}`);
    const result = await fetch(`${baseUrl}/plots/${query}/${filename}`, {
      mode: "no-cors",
    });
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.text();
  },
  getPlotURL(filename: string, query: string) {
    return `${baseUrl}/plots/${query}/${filename}`;
  },
};

const mockClient: APIClient = {
  async makeSearchQuery(searchText: string) {
    await delay(mockDelayMs);
    const result = mockSearch;
    return result;
  },
  async makeGenerateQuery(subclassFilter: SubclassFilter) {
    await delay(mockDelayMs);
    const result = mockMetadata;
    return result;
  },
  async makePlotQuery(filename: string, query: string) {
    console.log("fetching", `${baseUrl}/plots/${query}/${filename}`);
    const result = await fetch(
      `${baseUrl}/plots/${"Depression Music"}/${filename}`,
      {
        mode: "no-cors",
      }
    );
    if (!result.ok) throw new Error("Failed to fetch data");
    return result.text();
  },
  getPlotURL(filename: string, query: string) {
    return `${baseUrl}/plots/${"Depression Music"}/${filename}`;
  },
};

export function chooseClient(source: DataSource): APIClient {
  switch (source) {
    case "reddit":
      return redditClient;
    case "mock":
      return mockClient;
    default:
      return source satisfies never;
  }
}

export function navigateToPlot(
  source: DataSource,
  filename: string,
  query: string
) {
  let plotURL: string;
  plotURL = chooseClient(source).getPlotURL(filename, query);
  window.open(
    plotURL,
    "_blank",
    "location=yes,height=500,width=570,scrollbars=yes,status=yes"
  );
}
