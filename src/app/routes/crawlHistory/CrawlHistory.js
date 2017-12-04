var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CrawlHistory.html'),
  controller: CrawlHistory
};

/** @ngInject */
function CrawlHistory($http, $log, $stateParams, $state, moment, $q) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;
  vm.uuid = $stateParams.uuid;
  if (vm.uuid) {
    vm.getCrawlData();
  }
}

CrawlHistory.prototype = {
  getCrawlData: function () {
    var vm = this;
    vm.$state.go('.', {uuid: vm.uuid});
    vm.getDataset();
    vm.rowCollection = undefined;
    vm.$http.get('http://api.gbif.org/v1/dataset/' + vm.uuid + '/process', {params: {limit: 1000}})
      .then(function (response) {
        vm.rowCollection = response.data;
      })
      .catch(function () {
      });
  },
  getDataset: function () {
    var vm = this;
    vm.$http.get('http://api.gbif.org/v1/dataset/' + vm.uuid)
      .then(function (response) {
        vm.dataset = response.data;
      })
      .catch(function () {
      });
    vm.$http.get('http://api.gbif.org/v1/occurrence/search?limit=0&datasetKey=' + vm.uuid)
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
  isInSync: function (count) {
    var results = _.get(this, 'rowCollection.results', []);
    var first = _.find(results, function (e) {
      return e.finishReason === 'NORMAL' && true;
    });
    return _.get(first, 'fragmentsReceived', -1) === count;
  },
  querySearch: function (query) {
    var deferred = this.$q.defer();
    this.$http.get('https://api.gbif.org/v1/dataset/suggest', {params: {limit: 20, q: query}}).then(function (results) {
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
