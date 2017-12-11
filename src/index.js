var angular = require('angular');

// js lisb
require('angular-ui-router');
require('angular-material');
require('angular-moment');
require('angular-sanitize');
require('angular-chart.js');
require('ngstorage');

// css
require('angular-material/angular-material.css');
import './index.styl';

// routes
var App = require('./app/routes/App');
var CrawlHistory = require('./app/routes/crawlHistory/CrawlHistory');
var IptSyncState = require('./app/routes/iptSyncState/iptSyncState');
var Overcrawls = require('./app/routes/overcrawls/Overcrawls');
var CurrentCrawls = require('./app/routes/currentCrawls/CurrentCrawls');

// components
var Header = require('./app/components/Header');
var Nav = require('./app/components/Nav');

// configurations
var routesConfig = require('./routes.config');
var materialConfig = require('./material.config');
var env = require('./env.constant');

angular
  .module('app', ['ui.router', 'ngMaterial', 'angularMoment', 'ngSanitize', 'chart.js', 'ngStorage'])
  .config(routesConfig)
  .config(materialConfig)
  .constant('env', env)
  .component('app', App)
  .component('crawlHistory', CrawlHistory)
  .component('iptSyncState', IptSyncState)
  .component('overcrawls', Overcrawls)
  .component('currentCrawls', CurrentCrawls)
  .component('headerComponent', Header)
  .component('navComponent', Nav);

// base config
require('./filters');
