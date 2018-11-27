var about = require('./about.md');
var _ = require('lodash');
var async = require('async');

module.exports = {
  template: require('./PipelinesCrawls.html'),
  controller: PipelinesCrawls
};

/** @ngInject */
function PipelinesCrawls($http, $log, $timeout, $scope, $stateParams, $state, moment, $q, $interval, env) {

}
