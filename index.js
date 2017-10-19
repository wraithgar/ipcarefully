'use strict';

const IPRangeCheck = require('ip-range-check');
const Http = require('http');
const Https = require('https');
const Dns = require('dns');

class Lookup {

  constructor(settings) {

    assert(this.type === 'whitelist' || this.type === 'blacklist', 'type must be whitelist or blacklist');
    this.type = settings.type;
    this.iplist = settings.iplist;
  },

  filter(hostname, options, callback) {

    if (arguments.length ===2) {
      callback = options;
      options = {};
    }

    Dns.lookup(hostname, options, (err, address, family) => {

      if (err) {
        callback(err);
        return;
      }

      const ip_test = IPRangeCheck(address, this.iplist);

      if (ip_test && this.type === 'whitelist') { //IP on whitelist, pass
        callback(err, address, family);
        return;
      }
      if (!ip_test && this.type === 'blacklist') { //IP not on blacklist, pass
        callback(err, address, family);
        return;
      }
      //Fail
      callback(new Error(`Connection to IP ${address} not allowed`));
      return;
    });
  }

};

exports.http = function (settings) {

  const httpAgent = new Http.Agent(settings.agent);
  const lookup = new (Lookup(settings));

  httpAgent._oldCreateConnection_ = httpAgent.createConnection;
  httpAgent.createConnection = function (options) {

    options.lookup = lookup.filter;
    return this._oldCreateConnection_(...arguments);
  };

  return httpAgent;
};

exports.https = function (options) {

  const httpsAgent = new Https.Agent(settings.agent);
  const lookup = new (Lookup(settings));

  httpsAgent._oldCreateConnection_ = httpsAgent.createConnection;
  httpsAgent.createConnection = function (options) {

    options.lookup = lookup.filter;
    return this._oldCreateConnection_(...arguments);
  };

  return httpsAgent;
};
