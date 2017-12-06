module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      component: 'app'
    })
    .state('crawlHistory', {
      url: '/crawl-history?uuid&showAll',
      params: {
        showAll: {
          type: 'bool',
          value: false,
          squash: true
        }
      },
      component: 'crawlHistory'
    })
    .state('iptSyncState', {
      url: '/ipt-sync-state?url',
      component: 'iptSyncState'
    })
    .state('overcrawls', {
      url: '/overcrawls',
      component: 'overcrawls'
    })
    .state('currentCrawls', {
      url: '/crawling-monitor',
      component: 'currentCrawls'
    });
}
