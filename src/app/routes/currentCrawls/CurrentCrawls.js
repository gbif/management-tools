var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CurrentCrawls.html'),
  controller: CurrentCrawls
};

/** @ngInject */
function CurrentCrawls($http, $log, $stateParams, $state, moment, $q, $interval) {
  var vm = this;
  vm.tableColumns = [
    {abbr: 'URL', full: 'URL', field: '_url'},
    {abbr: 'DC', full: 'Declared count', field: '_declaredCount'},
    {abbr: 'PC', full: 'Pages crawled', field: 'pagesCrawled'},
    {abbr: 'PFS', full: 'Pages fragmented successfully', field: 'pagesFragmentedSuccessful'},
    {abbr: 'PFE', full: 'Pages not fragmented (error)', field: 'pagesFragmentedError'},
    {abbr: 'FE', full: 'Fragments emitted', field: 'fragmentsEmitted'},
    {abbr: 'FR', full: 'Fragments received', field: 'fragmentsReceived'},
    {abbr: 'RON', full: 'raw occurrences persisted (new)', field: 'rawOccurrencesPersistedNew'},
    {abbr: 'ROM', full: 'raw occurrences persisted (modified)', field: 'rawOccurrencesPersistedUpdated'},
    {abbr: 'ROU', full: 'raw occurrences persisted (unchanged)', field: 'rawOccurrencesPersistedUnchanged'},
    {abbr: 'ROE', full: 'raw occurrences persisted (error)', field: 'rawOccurrencesPersistedError'},
    {abbr: 'FP', full: 'Fragments processed', field: 'fragmentsProcessed'},
    {abbr: 'VOP', full: 'Verbatim Occurrences Persisted Successful', field: 'verbatimOccurrencesPersistedSuccessful'},
    {abbr: 'VOE', full: 'Verbatim Occurrences Persisted Error', field: 'verbatimOccurrencesPersistedError'},
    {
      abbr: 'OI',
      full: 'Interpreted Occurrences Persisted Successful',
      field: 'interpretedOccurrencesPersistedSuccessful'
    },
    {abbr: 'OE', full: 'Interpreted Occurrences Persisted Error', field: 'interpretedOccurrencesPersistedError'}
  ];
  vm.state = {
    sortReverse: true,
    sortType: 'fragmentsEmitted',
    pageSize: 100000
  };
  vm.pageSizes = [{nr: 10, name: 10}, {nr: 25, name: 25}, {nr: 50, name: 50}, {nr: 100000, name: 'all'}];
  vm.$http = $http;
  vm.$q = $q;
  vm.$interval = $interval;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.aboutContent = about;

  function getCrawling() {
    // vm.crawls = undefined;
    $http.get('https://crawler.gbif.org/dataset/process/running', {params: {_: Date.now()}})
      .then(function (response) {
        vm.crawls = [].concat(response.data.map(function (e) {
          return decorateCrawl(e);
        }));
      })
      .catch(function () {
      });
  }

  function decorateCrawl(crawl) {
    crawl._url = _.get(crawl, 'crawlJob.targetUrl');

    crawl._status = {};
    crawl._status.pagesFragmentedSuccessful = crawl.pagesCrawled === crawl.pagesFragmentedSuccessful ? 'green' : 'red';
    crawl._status.pagesFragmentedError = crawl.pagesFragmentedError > 0 ? 'red' : 'green';

    crawl._declaredCount = _.get(crawl, 'rawOccurrencesPersistedNew', 0) + _.get(crawl, 'rawOccurrencesPersistedUpdated', 0) + _.get(crawl, 'rawOccurrencesPersistedUnchanged', 0);
    return crawl;
  }

  vm.changeLive = function (isLive) {
    if (!isLive && angular.isDefined(this.stop)) {
      this.$interval.cancel(this.stop);
      this.stop = undefined;
    } else {
      this.stop = this.$interval(getCrawling, 1000);
    }
  };

  getCrawling();
}

/*eslint-disable */
var mockObj = [
  {
    "datasetKey": "150f1700-e93d-47c6-92f5-de44ab80e353",
    "crawlJob": {
      "datasetKey": "150f1700-e93d-47c6-92f5-de44ab80e353",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=rlp_b",
      "attempt": 465,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:21.206+0000",
    "finishedCrawling": "2017-12-07T13:14:21.268+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "374e0d4c-cf9f-4e1a-97a4-14123ee1bb7e",
    "crawlJob": {
      "datasetKey": "374e0d4c-cf9f-4e1a-97a4-14123ee1bb7e",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trom_fungi",
      "attempt": 469,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:14.521+0000",
    "finishedCrawling": "2017-12-07T13:13:14.707+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "9cc95cb1-d97a-4c35-9d0e-5de8a6e2f134",
    "crawlJob": {
      "datasetKey": "9cc95cb1-d97a-4c35-9d0e-5de8a6e2f134",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=nef_hym",
      "attempt": 559,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:16:28.824+0000",
    "finishedCrawling": "2017-12-07T13:16:28.890+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "4894f2f8-74b5-403e-bd8d-6fe5123a3f71",
    "crawlJob": {
      "datasetKey": "4894f2f8-74b5-403e-bd8d-6fe5123a3f71",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=nfh_algae",
      "attempt": 509,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:22.668+0000",
    "finishedCrawling": "2017-12-07T13:14:22.802+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "d29d79fd-2dc4-4ef5-89b8-cdf66994de0d",
    "crawlJob": {
      "datasetKey": "d29d79fd-2dc4-4ef5-89b8-cdf66994de0d",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trh_v",
      "attempt": 401,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:15:36.119+0000",
    "finishedCrawling": "2017-12-07T13:15:37.205+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "afaa80a2-6167-47e1-baae-5450206d07dd",
    "crawlJob": {
      "datasetKey": "afaa80a2-6167-47e1-baae-5450206d07dd",
      "endpointType": "BIOCASE",
      "targetUrl": "http://biocase.snsb.info/wrapper/pywrapper.cgi?dsa=ZSMarthrovariacoll",
      "attempt": 59,
      "properties": {
        "datasetTitle": "The Arthropoda Varia Collection at the Zoologische Staatssammlung München",
        "conceptualSchema": "http://www.tdwg.org/schemas/abcd/2.06"
      }
    },
    "startedCrawling": "2017-12-05T14:58:21.940+0000",
    "finishedCrawling": "2017-12-05T16:03:22.612+0000",
    "crawlContext": "{\"offset\":0,\"speculative\":false,\"lastContentHash\":-19783855624380196,\"aborted\":false,\"lowerBound\":\"Zaa\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 61,
    "pagesFragmentedSuccessful": 60,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 21488,
    "fragmentsReceived": 21488,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 21488,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 21488,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "fb1ecd28-f09e-4747-8bde-0b3d7a6f78d1",
    "crawlJob": {
      "datasetKey": "fb1ecd28-f09e-4747-8bde-0b3d7a6f78d1",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=bg_lichens",
      "attempt": 501,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:59.573+0000",
    "finishedCrawling": "2017-12-07T13:13:59.859+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "1f8694bd-6207-4685-921e-d29db4243947",
    "crawlJob": {
      "datasetKey": "1f8694bd-6207-4685-921e-d29db4243947",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=rmz_tabanidae",
      "attempt": 571,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:36.566+0000",
    "finishedCrawling": "2017-12-07T13:13:36.605+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "05ebc824-3a3b-4f64-ab22-99b0e2c3aa48",
    "crawlJob": {
      "datasetKey": "05ebc824-3a3b-4f64-ab22-99b0e2c3aa48",
      "endpointType": "BIOCASE",
      "targetUrl": "http://biocase.zfmk.de//pywrapper.cgi?dsa=ZFMK",
      "attempt": 49,
      "properties": {
        "datasetTitle": "Siphonaptera",
        "conceptualSchema": "http://www.tdwg.org/schemas/abcd/2.06"
      }
    },
    "startedCrawling": "2017-12-05T14:58:21.979+0000",
    "finishedCrawling": "2017-12-05T15:01:33.710+0000",
    "crawlContext": "{\"offset\":0,\"speculative\":false,\"lastContentHash\":698360646990785119,\"aborted\":false,\"lowerBound\":\"Zaa\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 27,
    "pagesFragmentedSuccessful": 26,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 31,
    "fragmentsReceived": 31,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 31,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 31,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "fb716825-2962-4375-8532-3ac7429aa86d",
    "crawlJob": {
      "datasetKey": "fb716825-2962-4375-8532-3ac7429aa86d",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trh_algae",
      "attempt": 895,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:35.202+0000",
    "finishedCrawling": "2017-12-07T13:14:35.273+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "263bbfe7-f643-43bb-b448-f0705d1c0e18",
    "crawlJob": {
      "datasetKey": "263bbfe7-f643-43bb-b448-f0705d1c0e18",
      "endpointType": "BIOCASE",
      "targetUrl": "http://biocase.zfmk.de//pywrapper.cgi?dsa=ZFMK-Herpetology",
      "attempt": 35,
      "properties": {
        "datasetTitle": "Herpetology",
        "conceptualSchema": "http://www.tdwg.org/schemas/abcd/2.06"
      }
    },
    "startedCrawling": "2017-12-05T14:58:21.963+0000",
    "finishedCrawling": "2017-12-05T15:02:38.857+0000",
    "crawlContext": "{\"offset\":0,\"speculative\":false,\"lastContentHash\":8215737423409059324,\"aborted\":false,\"lowerBound\":\"Zaa\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 31,
    "pagesFragmentedSuccessful": 30,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 9620,
    "fragmentsReceived": 9620,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 9620,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 9620,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "f60aa56f-cbb7-4f55-8a6d-67288d5ba9b1",
    "crawlJob": {
      "datasetKey": "f60aa56f-cbb7-4f55-8a6d-67288d5ba9b1",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=kmn_alge",
      "attempt": 500,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:23.177+0000",
    "finishedCrawling": "2017-12-07T13:14:23.228+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "baa86fb2-7346-4507-a34f-44e4c1bd0d57",
    "crawlJob": {
      "datasetKey": "baa86fb2-7346-4507-a34f-44e4c1bd0d57",
      "endpointType": "TAPIR",
      "targetUrl": "http://api.tela-botanica.org/tapirlink/tapir.php/cel",
      "attempt": 45,
      "properties": {
        "declaredCount": "230446",
        "conceptualSchema": "http://rs.tdwg.org/dwc/dwcore/"
      }
    },
    "startedCrawling": "2017-12-05T15:00:27.653+0000",
    "finishedCrawling": "2017-12-05T16:56:34.205+0000",
    "crawlContext": "{\"offset\":0,\"speculative\":true,\"lastContentHash\":1473585700189664813,\"aborted\":false,\"lowerBound\":\"Zza\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 3055,
    "pagesFragmentedSuccessful": 3054,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 305101,
    "fragmentsReceived": 305101,
    "rawOccurrencesPersistedNew": 353,
    "rawOccurrencesPersistedUpdated": 708,
    "rawOccurrencesPersistedUnchanged": 304040,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 305101,
    "verbatimOccurrencesPersistedSuccessful": 1061,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 1061,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "78c1a71e-abb2-49cf-abc8-efafb981b0e4",
    "crawlJob": {
      "datasetKey": "78c1a71e-abb2-49cf-abc8-efafb981b0e4",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trh_lichens",
      "attempt": 345,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:16:07.054+0000",
    "finishedCrawling": "2017-12-07T13:16:07.346+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "6ce9819a-d82b-41e1-9059-0dd201f15993",
    "crawlJob": {
      "datasetKey": "6ce9819a-d82b-41e1-9059-0dd201f15993",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=entomology_zmbn",
      "attempt": 547,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:16:29.308+0000",
    "finishedCrawling": "2017-12-07T13:16:29.659+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "d1c13016-51c4-4819-8e4d-56b2082baab4",
    "crawlJob": {
      "datasetKey": "d1c13016-51c4-4819-8e4d-56b2082baab4",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=nfli_lichens",
      "attempt": 525,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:17:50.536+0000",
    "finishedCrawling": "2017-12-07T13:17:50.605+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "d0aa984e-c6d3-45ee-8fc0-df1df8f4126b",
    "crawlJob": {
      "datasetKey": "d0aa984e-c6d3-45ee-8fc0-df1df8f4126b",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trom_vascular",
      "attempt": 655,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:17:39.881+0000",
    "finishedCrawling": "2017-12-07T13:17:40.680+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "68a0650f-96ae-499c-8b2a-a4f92c01e4b3",
    "crawlJob": {
      "datasetKey": "68a0650f-96ae-499c-8b2a-a4f92c01e4b3",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=o_bryophytes",
      "attempt": 465,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:22.226+0000",
    "finishedCrawling": "2017-12-07T13:14:22.432+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "dfcb0ee8-614f-11e2-897a-00145eb45e9a",
    "crawlJob": {
      "datasetKey": "dfcb0ee8-614f-11e2-897a-00145eb45e9a",
      "endpointType": "BIOCASE",
      "targetUrl": "http://www.systax.org/biocase/pywrapper.cgi?dsa=botgart",
      "attempt": 44,
      "properties": {
        "datasetTitle": "SysTax - Botanical Gardens",
        "conceptualSchema": "http://www.tdwg.org/schemas/abcd/2.06"
      }
    },
    "startedCrawling": "2017-12-05T14:59:26.665+0000",
    "finishedCrawling": "2017-12-05T18:27:36.467+0000",
    "crawlContext": "{\"offset\":600,\"speculative\":false,\"lastContentHash\":5780121937712340427,\"aborted\":false,\"lowerBound\":\"Zaa\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 1912,
    "pagesFragmentedSuccessful": 1911,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 189755,
    "fragmentsReceived": 189755,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 197235,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 189755,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "7e36d9b6-f762-11e1-a439-00145eb45e9a",
    "crawlJob": {
      "datasetKey": "7e36d9b6-f762-11e1-a439-00145eb45e9a",
      "endpointType": "DIGIR",
      "targetUrl": "http://digir.andesamazon.org/digir/DiGIR.php",
      "attempt": 48,
      "properties": {
        "declaredCount": "7328",
        "code": "BRIT",
        "manis": "false"
      }
    },
    "startedCrawling": "2017-12-05T15:00:27.634+0000",
    "finishedCrawling": "2017-12-05T15:02:18.445+0000",
    "crawlContext": "{\"offset\":0,\"speculative\":false,\"lastContentHash\":6318661811457315346,\"aborted\":false,\"lowerBound\":\"Zaa\",\"upperBound\":null}",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "processStateChecklist": "EMPTY",
    "processStateSample": "EMPTY",
    "pagesCrawled": 28,
    "pagesFragmentedSuccessful": 27,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 7323,
    "fragmentsReceived": 7323,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 7323,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 7323,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "eba5d1aa-35dd-4f0c-b1dc-304f6b44d3b3",
    "crawlJob": {
      "datasetKey": "eba5d1aa-35dd-4f0c-b1dc-304f6b44d3b3",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=sweco",
      "attempt": 605,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:12:32.767+0000",
    "finishedCrawling": "2017-12-07T13:12:32.947+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "40126b48-3511-4fbb-aa79-7d039779c387",
    "crawlJob": {
      "datasetKey": "40126b48-3511-4fbb-aa79-7d039779c387",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=nef_div",
      "attempt": 943,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:16:17.679+0000",
    "finishedCrawling": "2017-12-07T13:16:17.738+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "6728c42d-c4b6-4fda-a211-5ad1bb59cda4",
    "crawlJob": {
      "datasetKey": "6728c42d-c4b6-4fda-a211-5ad1bb59cda4",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trh_b",
      "attempt": 630,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:33.853+0000",
    "finishedCrawling": "2017-12-07T13:14:34.763+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "38b4c89f-584c-41bb-bd8f-cd1def33e92f",
    "crawlJob": {
      "datasetKey": "38b4c89f-584c-41bb-bd8f-cd1def33e92f",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "http://www.gbif.se/ipt/archive.do?r=artdata",
      "attempt": 130,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T12:52:32.157+0000",
    "finishedCrawling": "2017-12-07T12:57:47.368+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 2220000,
    "fragmentsReceived": 1595022,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 1595022,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 1595022,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "30bc94f2-50aa-4688-8e87-a8e11d3d69ff",
    "crawlJob": {
      "datasetKey": "30bc94f2-50aa-4688-8e87-a8e11d3d69ff",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=kmn_vascular",
      "attempt": 476,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:16:18.096+0000",
    "finishedCrawling": "2017-12-07T13:16:18.399+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "7eb54e10-fd36-4139-8764-1fd8abc2bd67",
    "crawlJob": {
      "datasetKey": "7eb54e10-fd36-4139-8764-1fd8abc2bd67",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trh_f",
      "attempt": 494,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:14:34.579+0000",
    "finishedCrawling": "2017-12-07T13:14:34.896+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "b80a8d39-2e0e-4ae4-91e4-03ee6dc9d1bc",
    "crawlJob": {
      "datasetKey": "b80a8d39-2e0e-4ae4-91e4-03ee6dc9d1bc",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=nfli_fungi",
      "attempt": 418,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:58.911+0000",
    "finishedCrawling": "2017-12-07T13:13:58.982+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "e87a12af-fc4c-4315-bff7-c7b827379aca",
    "crawlJob": {
      "datasetKey": "e87a12af-fc4c-4315-bff7-c7b827379aca",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=trom_lichens",
      "attempt": 531,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:47.840+0000",
    "finishedCrawling": "2017-12-07T13:13:48.010+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  },
  {
    "datasetKey": "7948250c-6958-4a29-a670-ed1015b26252",
    "crawlJob": {
      "datasetKey": "7948250c-6958-4a29-a670-ed1015b26252",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "https://data.gbif.no/ipt/archive.do?r=o_lichens",
      "attempt": 471,
      "properties": {}
    },
    "startedCrawling": "2017-12-07T13:13:35.906+0000",
    "finishedCrawling": "2017-12-07T13:13:36.410+0000",
    "finishReason": "NORMAL",
    "processStateOccurrence": "RUNNING",
    "pagesCrawled": 1,
    "pagesFragmentedSuccessful": 0,
    "pagesFragmentedError": 0,
    "fragmentsEmitted": 0,
    "fragmentsReceived": 0,
    "rawOccurrencesPersistedNew": 0,
    "rawOccurrencesPersistedUpdated": 0,
    "rawOccurrencesPersistedUnchanged": 0,
    "rawOccurrencesPersistedError": 0,
    "fragmentsProcessed": 0,
    "verbatimOccurrencesPersistedSuccessful": 0,
    "verbatimOccurrencesPersistedError": 0,
    "interpretedOccurrencesPersistedSuccessful": 0,
    "interpretedOccurrencesPersistedError": 0
  }
];

/*eslint-enable */
