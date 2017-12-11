module.exports = {
  template: require('./Nav.html'),
  controller: Nav,
  bindings: {
  }
};

/** @ngInject */
function Nav($state, $log, $mdSidenav) {
  this.$state = $state;
  this.$log = $log;
  this.$mdSidenav = $mdSidenav;
  this.menuOptions = [
    {name: 'Dataset Crawl History', state: 'crawlHistory'},
    {name: 'Overcrawled datasets', state: 'overcrawls'},
    {name: 'IPT sync state', state: 'iptSyncState'},
    {name: 'Crawling Monitor', state: 'currentCrawls'}
  ];
}

Nav.prototype = {
  changeState: function (state) {
    this.$state.go(state);
    this.$mdSidenav('left_nav')
      .close();
  }
};
