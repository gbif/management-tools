var welcome = require('./welcome.md');

module.exports = {
  template: require('./App.html'),
  controller: App
};

function App() {
  var vm = this;
  vm.welcome = welcome;
}
