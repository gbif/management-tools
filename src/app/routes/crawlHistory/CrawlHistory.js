var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./CrawlHistory.html'),
  controller: CrawlHistory
};

/** @ngInject */
function CrawlHistory($http, $log, $stateParams, $state, moment, $q, $localStorage, env) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.env = env;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.$localStorage = $localStorage;
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
  addToStorageArray: function (item) {
    var prev = _.get(this, '$localStorage.crawlHistoryUUID', []);
    var history = _.uniqBy(_.concat(prev, item), 'key');

    // remove empty
    _.remove(history, function (e) {
      return angular.isUndefined(e.key);
    });
    var cappedHistory = _.slice(history.reverse(), 0, 20).reverse();
    this.$localStorage.crawlHistoryUUID = cappedHistory;
  },
  getDataset: function () {
    var vm = this;
    vm.errorMessage = undefined;
    vm.$http.get(this.env.dataApi + '/dataset/' + vm.uuid)
      .then(function (response) {
        vm.dataset = response.data;
        vm.addToStorageArray({key: vm.uuid, title: response.data.title});
      })
      .catch(function (err) {
        if (err.status === 404) {
          vm.errorMessage = 'No such dataset found';
        }
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
    this.$log.log(item);
    if (this.isGuid(item)) {
      this.uuid = item;
      this.getCrawlData();
    }
  },
  selectedItemChange: function (item) {
    this.uuid = item.value;
    this.getCrawlData();
  },
  isOutOfSync: function (count) {
    console.log(count);
    var results = _.get(this, 'rowCollection.results', []);
    var first = _.find(results, function (e) {
      return e.finishReason === 'NORMAL';
    });
    if (!first) {
      return false;
    }
    var offBy = Math.abs((count / _.get(first, 'fragmentsReceived', count)) - 1);
    return offBy > 0.1;
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
};
