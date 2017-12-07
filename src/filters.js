var angular = require('angular');

/** @ngInject */
angular
  .module('app')
  .filter('localNumber', function () {
    return function (num, lang) {
      if (angular.isUndefined(num)) {
        return '';
      }
      return num.toLocaleString(lang);
    };
  })
  .filter('simplifyHttpUrls', function () {
    return function (url) {
      return url.replace(/^http(s)?:\/\/(www\.)?/, '');
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
