var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./Overcrawls.html'),
  controller: Overcrawls
};

function Overcrawls($http, $log, $stateParams, $state, moment, $q) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;
  vm.getDatasets();

  function compare(a, b) {
    if (a.val < b.val) {
      return -1;
    }
    if (a.val > b.val) {
      return 1;
    }
    return 0;
  }

  vm.populateChart = function () {
    vm.chartData = vm.datasets;
    vm.chartData.sort(compare);
    this.labels = [];
    this.data = [];
    vm.chartData.forEach(function (datum) {
      this.labels.push(datum.val);
      this.data.push(datum.count);
    });
  };
}

Overcrawls.prototype = {
  getDatasets: function () {
    var vm = this;
    vm.$http.get('https://crawler.gbif.org/dataset/overcrawled')
      .then(function (response) {
        vm.datasets = response.data;
        vm.populateChart();
      })
      .catch(function () {
      });
  },
  getHeight: function (list, crawl) {
    return 100 * crawl.count / _.maxBy(list, 'count').count;
  },
  getMaxWidth: function (list) {
    return 100 / list.length;
  }
};
