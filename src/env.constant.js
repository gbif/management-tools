var _ = require('lodash');

var environments = {
  prod: {
    dataApi: 'https://api.gbif.org/v1',
    iptProxy: 'https://www.gbif.org/api/installation/ipt/inventory/dataset',
    portal: 'https://www.gbif.org',
    env: 'prod'
  },
  uat: {
    dataApi: 'https://api.gbif-uat.org/v1',
    iptProxy: 'https://www.gbif-uat.org/api/installation/ipt/inventory/dataset',
    portal: 'https://www.gbif-uat.org',
    env: 'uat'
  },
  dev: {
    dataApi: 'https://api.gbif-dev.org/v1',
    iptProxy: 'https://www.gbif-dev.org/api/installation/ipt/inventory/dataset',
    portal: 'https://www.gbif-dev.org',
    env: 'dev'
  }
};

/*eslint-disable */
var domain = window.location.hostname;
/*eslint-enable */

var env = environments.prod;
if (_.endsWith(domain, 'gbif-uat.org')) {
  env = environments.uat;
} else if (_.endsWith(domain, 'gbif-dev.org')) {
  env = environments.dev;
}

module.exports = env;
