# About this tool

The overcrawl monitor helps spot datasets that might be overcrawled. **Be aware that the data in the table is only updated once a day** and that is **only shows DwC-A dataset crawls** currently.

## How it works
When a dataset is crawled all occurrence records created, updated or seen to be without change will be updated with the current crawl ID. Once a day a service inspects the index and identifies datasets with records within that dataset with a crawlID differing to the most recent crawl.  Under normal working conditions, all records should have the most recent crawl ID and any remaining should be deleted.  This will happen automatically up to a threshold.  The monitor shows all those remaining that ahve been identified as not meeting the conditions to be deleted automatically and **need administrator attention**.

It should be the case that this console shows no rows of data if all datasets are in sync.  **This is the goal**.

* GBIF count: how many records are in the GBIF index from this dataset.
* Last crawl count: how many records was provided in the last crawl of the dataset.
* Off by: how many percentage of teh dataset would be deleted if we deleted everything but the last crawl.
* Last crawl id: how many times have this dataset been crawled.
* Histogram: number of occurrences for different crawl IDs
