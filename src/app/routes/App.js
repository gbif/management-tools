var welcome = require('./welcome.md');

module.exports = {
  template: require('./App.html'),
  controller: App
};

function App() {
  var vm = this;
  vm.welcome = welcome;

  this.menuOptions = [
    {name: 'Dataset Crawl History', state: 'crawlHistory'},
    {name: 'Overcrawled datasets', state: 'overcrawls'},
    {name: 'IPT sync state', state: 'iptSyncState'},
    {name: 'Crawling Monitor', state: 'currentCrawls'}
  ];
}
