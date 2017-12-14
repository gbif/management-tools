var about = require('./about.md');
var _ = require('lodash');

module.exports = {
  template: require('./Overcrawls.html'),
  controller: Overcrawls
};

/** @ngInject */
function Overcrawls($http, $log, $state, moment, $q, env) {
  var vm = this;
  vm.$http = $http;
  vm.$q = $q;
  vm.env = env;
  vm.moment = moment;
  vm.$state = $state;
  vm.$log = $log;
  vm.currentNavItem = 'tool';
  vm.expandedRowMap = {};
  vm.aboutContent = about;

  vm.columns = [
    {field: 'recordCount', title: 'GBIF count'},
    {field: 'lastCrawlCount', title: 'Last crawl count'},
    {field: 'percentagePreviousCrawls', title: 'Off by %'},
    {field: 'lastCrawlId', title: 'Last crawl id'}
  ];
  vm.state = {
    sortReverse: true,
    sortType: 'recordCount'
  };

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
    vm.$http.get(this.env.crawler + '/dataset/overcrawled')
      .then(function (response) {
        vm.datasets = _.values(response.data);
        vm.totalRecordCount = _.sumBy(vm.datasets, 'recordCount');
        vm.totalLastCrawlCount = _.sumBy(vm.datasets, 'lastCrawlCount');
        vm.totalDataset = vm.datasets.length;
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
  },
  getChartData: function (dataset) {
    return [_.map(dataset.crawlInfo, 'count')];
  },
  getChartLabels: function (dataset) {
    return _.map(dataset.crawlInfo, 'crawlId');
  },
  getSeverityClass: function (dataset) {
    var offBy = Math.abs(dataset.percentagePreviousCrawls);
    if (offBy < 5) {
      return;
    }
    return offBy > 60 ? 'badge-red' : 'badge-yellow';
  }
};
