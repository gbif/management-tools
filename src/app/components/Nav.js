module.exports = {
  template: require('./Nav.html'),
  controller: Nav,
  bindings: {
  }
};

/** @ngInject */
function Nav($state, $log) {
  this.$state = $state;
  this.$log = $log;
  this.menuOptions = [
    {name: 'Crawl History', state: 'crawlHistory'},
    {name: 'Overcrawl monitor'},
    {name: 'IPT sync state', state: 'iptSyncState'},
    {name: 'Current crawls'}
  ];
}

Nav.prototype = {
  changeState: function (state) {
    this.$state.go(state);
  }
};
