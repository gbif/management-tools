var angular = require('angular');
require('angular-material/angular-material.css');

var todos = require('./app/todos/todos');
var App = require('./app/containers/App');
var CrawlHistory = require('./app/containers/crawlHistory/CrawlHistory');
var IptSyncState = require('./app/containers/iptSyncState/iptSyncState');
var Overcrawls = require('./app/containers/overcrawls/Overcrawls');
var Header = require('./app/components/Header');
var Nav = require('./app/components/Nav');
var MainSection = require('./app/components/MainSection');
var TodoTextInput = require('./app/components/TodoTextInput');
var TodoItem = require('./app/components/TodoItem');
var Footer = require('./app/components/Footer');
require('angular-ui-router');
require('angular-material');
require('angular-moment');
require('angular-sanitize');
require('angular-chart.js');
var routesConfig = require('./routes');

import './index.styl';

angular
  .module('app', ['ui.router', 'ngMaterial', 'angularMoment', 'ngSanitize', 'chart.js'])
  .config(routesConfig)
  .service('todoService', todos.TodoService)
  .component('app', App)
  .component('crawlHistory', CrawlHistory)
  .component('iptSyncState', IptSyncState)
  .component('overcrawls', Overcrawls)
  .component('headerComponent', Header)
  .component('navComponent', Nav)
  .component('footerComponent', Footer)
  .component('mainSection', MainSection)
  .component('todoTextInput', TodoTextInput)
  .component('todoItem', TodoItem)
  .filter('localNumber', function () {
    return function (num, lang) {
      if (angular.isUndefined(num)) {
        return '';
      }
      return num.toLocaleString(lang);
    };
  })
  .filter('formatAsPercentage', function () {
    return function (percentage) {
      var formatedPercentage = 0;
      if (!isFinite(percentage)) {
        return percentage;
      }
      if (percentage > 101) {
        formatedPercentage = percentage.toFixed();
      } else if (percentage > 100.1) {
        formatedPercentage = percentage.toFixed(1);
      } else if (percentage > 100) {
        formatedPercentage = 100.1;
      } else if (percentage === 100) {
        formatedPercentage = 100;
      } else if (percentage >= 99.9) {
        formatedPercentage = 99.9;
      } else if (percentage > 99) {
        formatedPercentage = percentage.toFixed(1);
      } else if (percentage >= 1) {
        formatedPercentage = percentage.toFixed();
      } else if (percentage >= 0.01) {
        formatedPercentage = percentage.toFixed(2);
      } else if (percentage < 0.01 && percentage !== 0) {
        formatedPercentage = 0.01;
      }
      return formatedPercentage;
    };
  });

angular
  .module('app')
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('deep-orange');
  });
