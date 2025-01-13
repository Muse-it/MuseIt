// add sources here eg. "reddit" | "spotify" | "youtube"
// type DataSource = "reddit";

import { IconTypes } from "solid-icons";
import { AiOutlineReddit } from "solid-icons/ai";
import { BiSolidGhost } from "solid-icons/bi";

export type DataSource = "reddit" | "mock";

type TDataSourceInfo = {
  displayName: string;
  // must be used in JSX as:
  // DataSourceInfo[source].icon({})
  icon: IconTypes;
};

export const dataSourceInfo: Record<DataSource, TDataSourceInfo> = {
  reddit: {
    displayName: "Reddit",
    icon: AiOutlineReddit,
  },
  mock: {
    displayName: "Mock",
    icon: BiSolidGhost,
  },
};
