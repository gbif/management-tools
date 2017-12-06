var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CurrentCrawls.html'),
  controller: CurrentCrawls
};

/*eslint-disable */
/*
 <tr id="full">
 <th><div>URL</div></th>
 <th><div>Declared count</div></th>
 <th><div>Pages crawled</div></th>
 <th><div>Pages fragmented successfully</div></th>
 <th><div>Pages not fragmented (error)</div></th>
 <th><div>Fragments emitted</div></th>
 <th><div>Fragments received</div></th>
 <th><div>Raw occurrence records<br/>persisted (new)</div></th>
 <th><div>Raw occurrence records<br/>persisted (modified)</div></th>
 <th><div>Raw occurrence records<br/>persisted (unchanged)</div></th>
 <th><div>Raw occurrence records<br/>persisted (error)</div></th>
 <th><div>Fragments processed</div></th>
 <th><div>Verbatim occurrence records<br/>persisted successfully</div></th>
 <th><div>Verbatim occurrence records<br/>not persisted (error)</div></th>
 <th><div>Occurrence records interpreted</div></th>
 <th><div>Occurrence records error<br/>on interpretation</div></th>
 <th style="width:150px" colspan="2"><div>Miscellaneous<!-- colspan 2 hides the UUID --></div></th>
 </tr>
 <tr id="abbr">
 <th>URL</th>
 <th title="Declared count">DC</th>
 <th title="Pages crawled">PC</th>
 <th title="Pages fragmented successfully">PFS</th>
 <th title="Pages not fragmented (error)">PFE</th>
 <th title="Fragments emitted">FE</th>
 <th title="Fragments received">FR</th>
 <th title="Raw occurrence records persisted (new)">RON</th>
 <th title="Raw occurrence records persisted (modified)">ROM</th>
 <th title="Raw occurrence records persisted (unchanged)">ROU</th>
 <th title="Raw occurrence records persisted (error)">ROE</th>
 <th title="Fragments processed">FP</th>
 <th title="Verbatim occurrence records persisted successfully">VOP</th>
 <th title="Verbatim occurrence records not persisted (error)">VOE</th>
 <th title="Occurrence records interpreted">OI</th>
 <th title="Occurrence records error on interpretation">OE</th>
 <th title="Miscellaneous" style="width:150px" colspan="2"><!-- colspan 2 hides the UUID --></th>
 </tr>


 { "mData": "crawlJob.targetUrl", sDefaultContent: "" },  // defaults to be fail safe when omitted in JSON
 { "mData": "declaredCount", sDefaultContent: "" },
 { "mData": "pagesCrawled", sDefaultContent: 0 },
 { "mData": "pagesFragmentedSuccessful", sDefaultContent: 0 },
 { "mData": "pagesFragmentedError", sDefaultContent: 0 },
 { "mData": "fragmentsEmitted", sDefaultContent: 0 },
 { "mData": "fragmentsReceived", sDefaultContent: 0 },
 { "mData": "rawOccurrencesPersistedNew", sDefaultContent: 0 },
 { "mData": "rawOccurrencesPersistedUpdated", sDefaultContent: 0 },
 { "mData": "rawOccurrencesPersistedUnchanged", sDefaultContent: 0 },
 { "mData": "rawOccurrencesPersistedError", sDefaultContent: 0 },
 { "mData": "fragmentsProcessed", sDefaultContent: 0 },
 { "mData": "verbatimOccurrencesPersistedSuccessful", sDefaultContent: 0 },
 { "mData": "verbatimOccurrencesPersistedError", sDefaultContent: 0 },
 { "mData": "interpretedOccurrencesPersistedSuccessful", sDefaultContent: 0 },
 { "mData": "interpretedOccurrencesPersistedError", sDefaultContent: 0 },
 { sDefaultContent: " ", 'bSortable': false },  // crawl logs
 { "mData": "datasetKey", 'bVisible': false, bSearchable: true }

 */
/*eslint-enable */

/** @ngInject */
function CurrentCrawls($http, $log, $stateParams, $state, moment, $q) {
  var vm = this;
  vm.tableColumns = [
    {abbr: 'URL', full: 'URL', field: '_url'},
    {abbr: 'DC', full: 'Declared count', field: 'declaredCount'},
    {abbr: 'PC', full: 'Pages crawled', field: 'pagesCrawled'},
    {abbr: 'PFS', full: 'Pages fragmented successfully', field: 'pagesFragmentedSuccessful'},
    {abbr: 'PFE', full: 'Pages not fragmented (error)', field: 'pagesFragmentedError'},
    {abbr: 'DC', full: 'Declaredcount', field: 'fragmentsEmitted'},
    {abbr: 'DC', full: 'Declaredcount', field: 'fragmentsReceived'},
    {abbr: 'DC', full: 'Declaredcount', field: 'rawOccurrencesPersistedNew'},
    {abbr: 'DC', full: 'Declaredcount', field: 'rawOccurrencesPersistedUpdated'},
    {abbr: 'DC', full: 'Declaredcount', field: 'rawOccurrencesPersistedUnchanged'},
    {abbr: 'DC', full: 'Declaredcount', field: 'rawOccurrencesPersistedError'},
    {abbr: 'DC', full: 'Declaredcount', field: 'fragmentsProcessed'},
    {abbr: 'DC', full: 'Declaredcount', field: 'verbatimOccurrencesPersistedSuccessful'},
    {abbr: 'DC', full: 'Declaredcount', field: 'verbatimOccurrencesPersistedError'},
    {abbr: 'DC', full: 'Declaredcount', field: 'interpretedOccurrencesPersistedSuccessful'},
    {abbr: 'DC', full: 'Declaredcount', field: 'interpretedOccurrencesPersistedError'}
  ];
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.aboutContent = about;
  vm.getCrawling();
}

CurrentCrawls.prototype = {
  getCrawling: function () {
    var vm = this;
    vm.crawls = undefined;
    vm.$http.get('https://crawler.gbif.org/dataset/process/running', {params: {_: Date.now()}})
      .then(function () {
        vm.crawls = mockObj; // response.data;
      })
      .catch(function () {
      });
  },
  decorateCrawl: function (crawl) {
    crawl._url = _.get(crawl, 'crawlJob.targetUrl');
    crawl._declaredCount = _.get(crawl, 'rawOccurrencesPersistedNew', 0) + _.get(crawl, 'rawOccurrencesPersistedUpdated', 0) + _.get(crawl, 'rawOccurrencesPersistedUnchanged', 0);
    return crawl;
  }
};

/*eslint-disable */
var mockObj = [
  {
    'datasetKey': '8575f23e-f762-11e1-a439-00145eb45e9a',
    'crawlJob': {
      'datasetKey': '8575f23e-f762-11e1-a439-00145eb45e9a',
      'endpointType': 'BIOCASE',
      'targetUrl': 'http://ww3.bgbm.org/biocase/pywrapper.cgi?dsa=pontaurus',
      'attempt': 44,
      'properties': {
        'datasetTitle': 'PonTaurus collection',
        'conceptualSchema': 'http://www.tdwg.org/schemas/abcd/2.06'
      }
    },
    'startedCrawling': '2017-12-05T09:53:25.453+0000',
    'crawlContext': '{\'offset\':0,\'speculative\':false,\'lastContentHash\':null,\'aborted\':false,\'lowerBound\':\'Aaa\',\'upperBound\':\'Baa\'}',
    'processStateOccurrence': 'RUNNING',
    'processStateChecklist': 'EMPTY',
    'processStateSample': 'EMPTY',
    'pagesCrawled': 1,
    'pagesFragmentedSuccessful': 0,
    'pagesFragmentedError': 0,
    'fragmentsEmitted': 0,
    'fragmentsReceived': 0,
    'rawOccurrencesPersistedNew': 0,
    'rawOccurrencesPersistedUpdated': 0,
    'rawOccurrencesPersistedUnchanged': 0,
    'rawOccurrencesPersistedError': 0,
    'fragmentsProcessed': 0,
    'verbatimOccurrencesPersistedSuccessful': 0,
    'verbatimOccurrencesPersistedError': 0,
    'interpretedOccurrencesPersistedSuccessful': 0,
    'interpretedOccurrencesPersistedError': 0
  },
  {
    "datasetKey": "2cc10a76-a0f4-4c6d-8703-3a62dc7f356f",
    "crawlJob": {
      "datasetKey": "2cc10a76-a0f4-4c6d-8703-3a62dc7f356f",
      "endpointType": "DWC_ARCHIVE",
      "targetUrl": "http://ipt-benin.gbif.fr/archive.do?r=nature_tropicale_new",
      "attempt": 34,
      "properties": {}
    },
    "startedCrawling": "2017-12-05T10:32:08.091+0000",
    "finishedCrawling": "2017-12-05T10:32:08.320+0000",
    "finishReason": "NOT_MODIFIED",
    "processStateOccurrence": "FINISHED",
    "processStateChecklist": "FINISHED",
    "processStateSample": "FINISHED",
    "pagesCrawled": 0,
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
