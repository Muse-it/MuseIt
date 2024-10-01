export enum PlotTypes {
  emotion = "emotion",
  sentiment = "sentiment",
  topics = "topics",
  hierarchical_topics = "hierarchical_topics",
  topics_visualization = "topics_visualization",
}

export function getEnumValues(obj) {
  const res = Object.keys(obj).filter((e) => e.length > 1);
  console.log(res);
  return res;
}

export enum PlotWindows {
  percentage = "percentage",
  time_series_M = "time_series_M",
  time_series_D = "time_series_D",
  time_series_W = "time_series_W",
}

export type PlotConfig = {
  type: PlotTypes;
  window: PlotWindows;
};

// const confDelimiter = "*";

// export function stringifyPlotConfig(conf: PlotConfig) {
//   return `${conf.type}${confDelimiter}${conf.window}`;
// }

// export function parsePlotConfig(confString: string) {
//   const parts = confString.split(confDelimiter);
//   return { type: parts[0], window: parts[1] } as PlotConfig;
// }

export function getFilename(conf: PlotConfig) {
  if (
    conf.type === PlotTypes.hierarchical_topics ||
    conf.type === PlotTypes.topics_visualization
  ) {
    // return `${getEnumValues(PlotTypes)[conf.type]}.html`;
    return `${conf.type}.html`;
  } else {
    return `${conf.type}_${conf.window}.html`;
  }
}
