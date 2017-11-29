module.exports = {
  template: require('./CrawlHistory.html'),
  controller: CrawlHistory
};

function CrawlHistory($http, $log, $stateParams) {
  this.$http = $http;
  this.$log = $log;
  this.uuid = $stateParams.uuid;
  if (this.uuid) {
    this.getCrawlData();
  }
}

CrawlHistory.prototype = {
  getCrawlData: function () {
    var vm = this;
    this.getDataset();
    this.$http.get('http://api.gbif.org/v1/dataset/' + vm.uuid + '/process', {params: {limit: 1000}})
      .then(function (response) {
        vm.rowCollection = response.data;
      })
      .catch(function () {
      });
  },
  getDataset: function () {
    var vm = this;
    this.$http.get('http://api.gbif.org/v1/dataset/' + vm.uuid)
      .then(function (response) {
        vm.dataset = response.data;
      })
      .catch(function () {
      });
  }
};
