/*eslint-disable */
var about = require('./about.md');
var _ = require('lodash');
var async = require('async');

module.exports = {
  template: require('./PipelinesCrawls.html'),
  controller: PipelinesCrawls
};

/** @ngInject */
function PipelinesCrawls($http, $log, $timeout) {
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
    $http.get(env.dataApi + '/pipelines/process/running')
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

  function decorateWithMetrics(crawl, cb){
    var year = new Date().getFullYear();
    var url = 'http://logs.gbif.org:5601/elasticsearch/dev-pipeline-metric-' + year + '*/_search';
    var data = '{"size":0,"aggs":{"unique_name":{"terms":{"field":"name.keyword"},"aggs":{"max_value":{"max":{"field":"value"}}}}},"query":{"bool":{"must":[{"match":{"datasetId":"' + crawl.datasetKey + '"}},{"match":{"attempt":"' + crawl.attempt + '"}},{"match":{"type":"GAUGE"}},{"match_phrase_prefix":{"name":"driver.PipelinesOptionsFactory"}}]}}}';
    var config = {headers: {'Content-Type': 'application/json', 'kbn-xsrf': 'reporting'}};
    $http.post(url, data, config)
      .then(function (response) {
        //var metrics = response.data;
        var metrics = {"took":9,"timed_out":false,"_shards":{"total":10,"successful":10,"skipped":0,"failed":0},"hits":{"total":83,"max_score":0.0,"hits":[]},"aggregations":{"unique_name":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_metadata_ParMultiDo_Metadata.org.gbif.pipelines.transforms.RecordTransforms.MetadataRecord","doc_count":16,"max_value":{"value":1.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Filter_duplicates_Filtering_duplicates_ParMultiDo_Anonymous.org.gbif.pipelines.transforms.UniqueIdTransform.UniqueRecords","doc_count":13,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_basic_ParMultiDo_Basic.org.gbif.pipelines.transforms.RecordTransforms.BasicRecord","doc_count":13,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_multimedia_ParMultiDo_Multimedia.org.gbif.pipelines.transforms.RecordTransforms.MultimediaRecord","doc_count":12,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_temporal_ParMultiDo_Temporal.org.gbif.pipelines.transforms.RecordTransforms.TemporalRecord","doc_count":12,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_taxonomy_ParMultiDo_Taxonomy.org.gbif.pipelines.transforms.RecordTransforms.TaxonRecord","doc_count":9,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Interpret_location_ParMultiDo_Location.org.gbif.pipelines.transforms.RecordTransforms.LocationRecord","doc_count":4,"max_value":{"value":583964.0}},{"key":"driver.PipelinesOptionsFactory.Beam.Metrics.Merging_to_json_ParMultiDo_Anonymous.org.gbif.pipelines.core.converters.GbifJsonConverter.JsonConverter","doc_count":4,"max_value":{"value":583964.0}}]}}};
        var array = [];

        for (const bucket of metrics.aggregations.unique_name.buckets) {
          var value = {name:"EMPTY", value:0};
          value.name = parseMetricName(bucket.key);
          value.value = bucket.max_value.value;
          array.push(value);
        }
        crawl.metrics = array;
      })
      .catch(function () {
        // ignore errors
        cb();
      });
  }

  function parseMetricName(name){
    var start = 0;
    for (i = name.length; i > 0 ; i--) {
      if(name[i] == '.'){
        if(start !== 0){
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
