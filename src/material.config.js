module.exports = materialConfig;

/** @ngInject */
function materialConfig($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('deep-orange');
}
