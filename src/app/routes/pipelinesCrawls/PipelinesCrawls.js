var about = require('./about.md');
var _ = require('lodash');
var async = require('async');

module.exports = {
  template: require('./PipelinesCrawls.html'),
  controller: PipelinesCrawls
};

/** @ngInject */
function PipelinesCrawls($http, $log, $timeout, env) {
  var vm = this;
  vm.tableColumns = [
    {abbr: 'T', full: 'Title', field: 'title'},
    {abbr: 'DK', full: 'Dataset key', field: 'datasetKey'},
    {abbr: 'A', full: 'Attempt', field: 'attempt'},
    {abbr: 'S', full: 'Steps', field: 'pipelinesSteps'},
    {abbr: 'M', full: 'Metrics', field: 'metrics'}
  ];
  vm.aboutContent = about;

  function getCrawling() {
    $http.get(env.dataApi + '/pipelines/process/running', {params: {_: Date.now()}})
      .then(function (response) {
        vm.originalData = angular.fromJson(angular.toJson(_.keyBy(response.data, 'crawlId')));
        // Decorate pipeline steps
        vm.crawls = response.data.map(function (e) {
          return decorateCrawlSteps(e);
        });
        // Decorate dataset title
        async.eachLimit(vm.crawls, 10, decorateWithDatasetTitle, function () {
          // ignore errors
        });
        // Decorate pipeline metrics
        async.eachLimit(vm.crawls, 10, decorateWithMetrics, function () {
          // ignore errors
        });
        $log.info(vm.crawls);
      })
      .catch(function () {
      })
      .finally(function () {
        if (vm.isLive) {
          vm.liveTimeout = $timeout(getCrawling, 2000);
        }
      });
  }

  function decorateCrawlSteps(crawl) {
    crawl.datasetKey = crawl.crawlId.substring(0, 36);
    crawl.attempt = crawl.crawlId.substring(37, crawl.length);

    return crawl;
  }

  function decorateWithDatasetTitle(crawl, cb) {
  // get dataset title if not already there
    $http.get(env.dataApi + '/dataset/' + crawl.datasetKey, {cache: true})
      .then(function (response) {
        crawl.title = response.data.title;
      })
      .catch(function () {
        // ignore errors
        cb();
      });
  }

  function decorateWithMetrics(crawl, cb) {
    var env = 'dev';
    var year = new Date().getFullYear();
    var url = 'https://logs.gbif.org/' + env + '-pipeline-metric-' + year + '*/_search';
    var data = '{"size":0,"aggs":{"unique_name":{"terms":{"field":"name.keyword"},"aggs":{"max_value":{"max":{"field":"value"}}}}},"query":{"bool":{"must":[{"match":{"datasetId":"' + crawl.datasetKey + '"}},{"match":{"attempt":"' + crawl.attempt + '"}},{"match":{"type":"GAUGE"}},{"match_phrase_prefix":{"name":"driver.PipelinesOptionsFactory"}}]}}}';
    var config = {headers: {'Content-Type': 'application/json'}};
    $http.post(url, data, config)
      .then(function (response) {
        var array = [];

        response.data.aggregations.unique_name.buckets.forEach(function (bucket) {
          var value = {name: 'EMPTY', value: 0};
          value.name = parseMetricName(bucket.key);
          value.value = bucket.max_value.value;
          array.push(value);
        });

        crawl.metrics = array;
      })
      .catch(function () {
        // ignore errors
        cb();
      });
  }

  function parseMetricName(name) {
    var start = 0;
    for (var i = name.length; i > 0; i--) {
      if (name[i] === '.') {
        if (start !== 0) {
          start = i;
          break;
        }
        start = i;
      }
    }
    return name.substring(start + 1, name.length);
  }

  getCrawling();
}
