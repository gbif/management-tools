var about = require('./about.md');
var _ = require('lodash');
var async = require('async');

// var results = require('./test.json');

module.exports = {
  template: require('./iptSyncState.html'),
  controller: syncState
};

/** @ngInject */
function syncState($http, $log, $stateParams, $state, moment, $q, env) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;
  vm.url = $stateParams.url;

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

  vm.getInventory = function (url) {
    if (!url) {
      return;
    }
    if (_.endsWith(url, '/inventory/dataset')) {
      url = url.replace(/\/inventory\/dataset$/, '');
    } else {
      url = url.replace(/\/$/g, '');
    }

    vm.$state.go('.', {url: url});

    $http.get(env.iptProxy, {params: {iptBaseURL: url}})
      .then(function (response) {
        vm.registeredResources = response.data.registeredResources;
        decorate(vm.registeredResources);
      })
      .catch(function (err) {
        $log.error(err);
      });
  };

  function decorate(registeredResources) {
    async.eachLimit(registeredResources, 10, function (item, cb) {
      $http.get(env.dataApi + '/occurrence/count', {params: {datasetKey: item.gbifKey}}).then(function (results) {
        item._gbifCount = results.data;
      });
      cb();
    }, function (err) {
      $log.log('err');
      $log.log(err);
    });
  }

  vm.searchOnEnter = function (event) {
    if (event.which === 13) {
      vm.getInventory(vm.url);
    }
  };

  if (vm.url) {
    vm.getInventory(vm.url);
  }
}
