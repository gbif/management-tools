var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CrawlHistory.html'),
  controller: CrawlHistory
};

function isGuid(stringToTest) {
  var regexGuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/gi;
  return regexGuid.test(stringToTest);
}

function CrawlHistory($http, $log, $stateParams, $state, moment, $q) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.aboutContent = about;
  vm.uuid = $stateParams.uuid;
  if (vm.uuid) {
    vm.getCrawlData();
  }

  vm.querySearch = function (query) {
    var deferred = $q.defer();
    $http.get('https://api.gbif.org/v1/dataset/suggest', {params: {limit: 20, q: query}}).then(function (results) {
      deferred.resolve(results.data.map(function (e) {
        return {value: e.key, title: e.title};
      }));
    });
    return deferred.promise;
  };

  vm.selectedItemChange = function (item) {
    vm.uuid = item.value;
    vm.getCrawlData();
  };

  vm.inputChanged = function (item) {
    if (isGuid(item)) {
      vm.getCrawlData();
    }
  };

  vm.isInSync = function (count) {
    var results = _.get(vm, 'rowCollection.results', []);
    var first = _.find(results, function (e) {
      return e.finishReason === 'NORMAL' && true;
    });
    return _.get(first, 'fragmentsReceived', -1) === count;
  };
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
    var vm = this;
    vm.uuid = vm.rowCollection = vm.dataset = undefined;
    vm.$state.go('.', {uuid: undefined});
  },
  getDuration: function (row) {
    var vm = this;
    var duration = vm.moment.duration(vm.moment(row.finishedCrawling).diff(vm.moment(row.startedCrawling)));
    return duration.asHours();
  }
};
