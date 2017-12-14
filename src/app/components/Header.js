module.exports = {
  template: require('./Header.html'),
  controller: Header,
  bindings: {}
};

/** @ngInject */
function Header($log, $mdMedia, $mdSidenav, $state) {
  this.$state = $state;
  this.mdMedia = function (size) {
    return $mdMedia(size);
  };

  this.toggleMenu = function () {
    $mdSidenav('left_nav')
      .toggle();
  };

  this.changeState = function (state) {
    $state.go(state);
    $mdSidenav('left_nav')
      .close();
  };
}
