module.exports = {
  template: require('./Header.html'),
  controller: Header,
  bindings: {}
};

/** @ngInject */
function Header($log, $mdMedia, $mdSidenav) {
  this.mdMedia = function (size) {
    return $mdMedia(size);
  };

  this.toggleMenu = function () {
    $mdSidenav('left_nav')
      .toggle();
  };
}
