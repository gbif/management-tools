var angular = require('angular');
require('angular-material/angular-material.css');

var todos = require('./app/todos/todos');
var App = require('./app/containers/App');
var CrawlHistory = require('./app/containers/crawlHistory/CrawlHistory');
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
var routesConfig = require('./routes');

import './index.styl';

angular
  .module('app', ['ui.router', 'ngMaterial', 'angularMoment', 'ngSanitize'])
  .config(routesConfig)
  .service('todoService', todos.TodoService)
  .component('app', App)
  .component('crawlHistory', CrawlHistory)
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
  });

angular
  .module('app')
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .accentPalette('deep-orange');
  });
