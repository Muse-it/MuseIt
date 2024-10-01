type NumberKeyedObj = { [key: number]: string | number };

// assumes that all [NumberKeyedObjs] are equal in length
export type TMetadata = {
  subreddit: NumberKeyedObj;
  title: NumberKeyedObj;

  // can be NaN
  body: NumberKeyedObj;
  url: NumberKeyedObj;

  // eg. "2024-09-01 07:51:35"
  created_utc: NumberKeyedObj;

  // is a number
  num_comments: NumberKeyedObj;
  comments: NumberKeyedObj;
  topics: NumberKeyedObj;
  sentiment: NumberKeyedObj;
  emotion: NumberKeyedObj;
  merged_text: NumberKeyedObj;
  all_links: NumberKeyedObj;
  spotify_links: NumberKeyedObj;
};
