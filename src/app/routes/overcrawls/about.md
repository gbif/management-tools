# About this tool

The overcrawl monitor helps spot datasets that might be overcrawled. **Be aware that the data in the table is only updated once a day.**

## How it works
When a dataset is crawled all occurrences get assigned a crawl id. No matter if it is a new or an updated occurrence. 
In theory every new crawl should wipe existing records and only keep the ones present in this crawl. But due to quality issues in publishing we are careful in doing so.

Sometimes a dataset might for example assign new occurrence IDs to all records despite it being updates. Such a case would require special attention.

If a dataset has occurrences from multiple crawls it will instead show here. And data managers can consider what should happen from this point.

* GBIF count: how many records are in the GBIF index from this dataset.
* Last crawl count: how many records was provided in the last crawl of the dataset.
* Off by: how many percentage of teh dataset would be deleted if we deleted everything but the last crawl.
* Last crawl id: how many times have this dataset been crawled.
* Histogram: number of occurrences for different crawl IDs