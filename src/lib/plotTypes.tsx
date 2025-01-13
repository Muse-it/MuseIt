export enum PlotTypes {
  emotion = "emotion",
  sentiment = "sentiment",
  topics = "topics",

  // window disabled:
  hierarchical_topics = "hierarchical_topics",
  topics_visualization = "topics_visualization",
  wordcloud = "wordcloud",
  topic_txts = "topic_txts",
}

export function isWindowDisabled(type: PlotTypes) {
  const windowDisabledFor = [
    PlotTypes.hierarchical_topics,
    PlotTypes.topics_visualization,
    PlotTypes.wordcloud,
    PlotTypes.topic_txts,
  ];
  return windowDisabledFor.includes(type);
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
  } else if (conf.type == PlotTypes.wordcloud) {
    return `${conf.type}.png`;
  } else if (conf.type == PlotTypes.topic_txts) {
    return `${conf.type}.zip`;
  } else {
    return `${conf.type}_${conf.window}.html`;
  }
}
