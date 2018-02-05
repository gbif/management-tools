var about = require('./about.md');
var _ = require('lodash');
var async = require('async');

// var results = require('./test.json');

module.exports = {
  template: require('./iptSyncState.html'),
  controller: syncState
};

/** @ngInject */
function syncState($http, $log, $stateParams, $state, moment, $q, env, $localStorage) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.env = env;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;
  vm.url = $stateParams.url;
  vm.$localStorage = $localStorage;

  vm.getInventory = function (url) {
    if (!_.isString(url) || url === '') {
      vm.registeredResources = undefined;
      vm.currentUrl = undefined;
      vm.$state.go('.', {url: url});
      return;
    }

    if (!_.startsWith(url, 'http')) {
      url = 'http://' + url;
    }

    if (_.endsWith(url, '/inventory/dataset')) {
      url = url.replace(/\/inventory\/dataset$/, '');
    } else {
      url = url.replace(/\/$/g, '');
    }
    vm.url = url;
    vm.currentUrl = url;

    vm.$state.go('.', {url: url});
    vm.expandedRowMap = {};
    vm.inventoryFetchFailure = false;
    $http.get(env.iptProxy, {params: {iptBaseURL: url}})
      .then(function (response) {
        addToStorageArray(url);
        vm.registeredResources = response.data.registeredResources;
        decorate(vm.registeredResources);
      })
      .catch(function (err) {
        $log.error(err);
        vm.inventoryFetchFailure = true;
      });
  };

  function addToStorageArray(item) {
    $localStorage.iptUrls = _.slice(_.uniq($localStorage.iptUrls ? _.concat($localStorage.iptUrls, item) : [item]).reverse(), 0, 20).reverse();
  }

  function decorate(registeredResources) {
    registeredResources.forEach(function (e) {
      if (e.type === 'OCCURRENCE') {
        e.occurrenceCount = e.records;
      } else {
        e.occurrenceCount = _.get(e, 'recordsByExtension["http://rs.tdwg.org/dwc/terms/Occurrence"]', 0);
      }
    });
    async.eachLimit(registeredResources, 10, function (item, cb) {
      $http.get(env.dataApi + '/occurrence/count', {params: {datasetKey: item.gbifKey}}).then(function (results) {
        item._gbifCount = results.data;
      });
      cb();
    }, function (err) {
      if (err) {
        $log.error(err);
      }
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
