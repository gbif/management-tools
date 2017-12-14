var about = require('./about.md');
var _ = require('lodash');
// var async = require('async');

module.exports = {
  template: require('./CurrentCrawls.html'),
  controller: CurrentCrawls
};

/** @ngInject */
function CurrentCrawls($http, $log, $timeout, $scope, $stateParams, $state, moment, $q, $interval, env) {
  var vm = this;
  vm.tableColumns = [
    {abbr: 'URL', full: 'URL', field: '_url'},
    {abbr: 'DC', full: 'Declared count', field: '_declaredCount'},
    // {abbr: 'IC', full: 'Count in occurrence index', field: '_indexCount'},
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
  vm.env = env;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.aboutContent = about;
  vm.liveTimeout = undefined;

  function getCrawling() {
    $http.get(env.crawler + '/dataset/process/running', {params: {_: Date.now()}})
      .then(function (response) {
        vm.originalData = angular.fromJson(angular.toJson(_.keyBy(response.data, 'datasetKey')));
        vm.crawls = response.data.map(function (e) {
          return decorateCrawl(e);
        });
      })
      .catch(function () {
      })
      .finally(function () {
        if (vm.isLive) {
          vm.liveTimeout = $timeout(getCrawling, 2000);
        }
      });
  }

  $scope.$on('$destroy', function () {
    vm.isLive = false;
    if (angular.isDefined(vm.liveTimeout)) {
      $timeout.cancel(vm.liveTimeout);
    }
  });

  vm.decorations = {};
  vm.selected = {};

  function decorateCrawl(crawl) {
    crawl._url = _.get(crawl, 'crawlJob.targetUrl');

    /*eslint-disable */
    crawl._log = "http://elk.gbif.org:5601/app/kibana#/discover?_a=(filters:!((meta:(alias:!n,disabled:!f,index:'" + env.env + "-crawl-*',key:datasetKey,negate:!f,value:'" + crawl.datasetKey + "'),query:(match:(datasetKey:(query:'" + crawl.datasetKey + "',type:phrase))))),index:'" + env.env + "-crawl-*')&_g=(time:(from:now-7d,mode:quick,to:now))";
    /*eslint-enable */

    // decorate with error messages
    crawl._status = {};
    crawl._status.pagesFragmentedSuccessful = crawl.pagesCrawled === crawl.pagesFragmentedSuccessful ? 'green' : 'red';
    crawl._status.pagesFragmentedError = crawl.pagesFragmentedError > 0 ? 'red' : 'green';
    crawl._status.fragmentsReceived = crawl.fragmentsEmitted === crawl.fragmentsReceived ? 'green' : 'red';
    crawl._status.rawOccurrencesPersistedError = crawl.rawOccurrencesPersistedError > 0 ? 'red' : 'green';
    crawl._status.fragmentsProcessed = crawl.fragmentsReceived === crawl.fragmentsProcessed ? 'green' : 'red';
    crawl._status.verbatimOccurrencesPersistedSuccessful = crawl.verbatimOccurrencesPersistedSuccessful === crawl.rawOccurrencesPersistedNew + crawl.rawOccurrencesPersistedUpdated ? 'green' : 'red';
    crawl._status.verbatimOccurrencesPersistedError = crawl.verbatimOccurrencesPersistedError > 0 ? 'red' : 'green';
    crawl._status.interpretedOccurrencesPersistedSuccessful = crawl.verbatimOccurrencesPersistedSuccessful === crawl.interpretedOccurrencesPersistedSuccessful ? 'green' : 'red';
    crawl._status.interpretedOccurrencesPersistedError = crawl.interpretedOccurrencesPersistedError > 0 ? 'red' : 'green';
    crawl._status.declaredCount = crawl.declaredCount === crawl.rawOccurrencesPersistedNew + crawl.rawOccurrencesPersistedUpdated + crawl.rawOccurrencesPersistedUnchanged ? 'green' : 'red';

    // get dataset title if not already there
    $http.get(env.dataApi + '/dataset/' + crawl.datasetKey, {cache: true})
      .then(function (response) {
        crawl._title = response.data.title;
      })
      .catch(function () {
        // ignore errors
      });

    // get occurrence ount from index
    $http.get(env.dataApi + '/occurrence/search', {cache: true, params: {datasetKey: crawl.datasetKey, limit: 0}})
      .then(function (response) {
        crawl._indexCount = response.data.count;
      })
      .catch(function () {
        // ignore errors
      });
    return crawl;
  }

  vm.changeLive = function (isLive) {
    if (!isLive && angular.isDefined(vm.liveTimeout)) {
      $timeout.cancel(vm.liveTimeout);
      vm.liveTimeout = undefined;
    } else {
      getCrawling();
    }
  };

  getCrawling();
}
