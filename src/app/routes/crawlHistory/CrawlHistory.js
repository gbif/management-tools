var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CrawlHistory.html'),
  controller: CrawlHistory
};

/** @ngInject */
function CrawlHistory($http, $log, $stateParams, $state, moment, $q, env) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.env = env;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;
  vm.limit = 500;
  vm.uuid = $stateParams.uuid;
  vm.showAll = $stateParams.showAll;
  if (vm.uuid) {
    vm.getCrawlData();
  }
}

CrawlHistory.prototype = {
  getCrawlData: function () {
    var vm = this;
    vm.$state.go('.', {uuid: vm.uuid, showAll: vm.showAll});
    vm.getDataset();
    vm.rowCollection = undefined;
    vm.$http.get(this.env.dataApi + '/dataset/' + vm.uuid + '/process', {params: {limit: vm.limit}})
      .then(function (response) {
        vm.rowCollection = response.data;
        vm.finishReasonNormalCount = _.filter(response.data.results, {finishReason: 'NORMAL'}).length;
      })
      .catch(function () {
      });
  },
  updateShowAll: function (state) {
    this.showAll = state;
    // this.$state.go('.', {showAll: this.showAll}, {inherit: true, notify: false, reload: false});
  },
  getDataset: function () {
    var vm = this;
    vm.$http.get(this.env.dataApi + '/dataset/' + vm.uuid)
      .then(function (response) {
        vm.dataset = response.data;
      })
      .catch(function () {
      });
    vm.$http.get(this.env.dataApi + '/occurrence/search?limit=0&datasetKey=' + vm.uuid)
      .then(function (response) {
        vm.occurrences = response.data;
      })
      .catch(function () {
      });
  },
  clearDataset: function () {
    this.uuid = this.rowCollection = this.dataset = undefined;
    this.$state.go('.', {uuid: undefined});
    this.expandedRowMap = {};
  },
  getDuration: function (row) {
    var duration = this.moment.duration(this.moment(row.finishedCrawling).diff(this.moment(row.startedCrawling)));
    return duration.asHours();
  },
  inputChanged: function (item) {
    if (this.isGuid(item)) {
      this.getCrawlData();
    }
  },
  selectedItemChange: function (item) {
    this.uuid = item.value;
    this.getCrawlData();
  },
  isOutOfSync: function (count) {
    var results = _.get(this, 'rowCollection.results', []);
    var first = _.find(results, function (e) {
      return e.finishReason === 'NORMAL' && _.get(e, 'crawlJob.endpointType') === 'DWC_ARCHIVE';
    });
    if (!first) {
      return false;
    }
    return _.get(first, 'fragmentsReceived', -1) !== count;
  },
  querySearch: function (query) {
    var deferred = this.$q.defer();
    this.$http.get(this.env.dataApi + '/dataset/suggest', {params: {limit: 20, q: query}}).then(function (results) {
      deferred.resolve(results.data.map(function (e) {
        return {value: e.key, title: e.title};
      }));
    });
    return deferred.promise;
  },
  isGuid: function (stringToTest) {
    var regexGuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/gi;
    return regexGuid.test(stringToTest);
  }
}
;
