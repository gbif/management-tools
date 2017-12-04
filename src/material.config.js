module.exports = materialConfig;

/** @ngInject */
function materialConfig($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('deep-orange');
}
