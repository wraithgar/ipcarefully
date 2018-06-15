'use strict';

const Assert = require('assert');
const Dns = require('dns');
const Http = require('http');
const Https = require('https');
const IPRangeCheck = require('ip-range-check');


const lookup = function (settings) {

    Assert(settings.type === 'whitelist' || settings.type === 'blacklist', 'type must be whitelist or blacklist');

    const filter = function (hostname, options, callback) {

        if (arguments.length === 2) {
            callback = options;
            options = {};
        }

        Dns.lookup(hostname, options, (err, address, family) => {

            if (err) {
                callback(err);
                return;
            }

            const ip_test = IPRangeCheck(address, settings.iplist);

            if (ip_test && settings.type === 'whitelist') { //IP on whitelist, pass
                callback(err, address, family);
                return;
            }

            if (!ip_test && settings.type === 'blacklist') { //IP not on blacklist, pass
                callback(err, address, family);
                return;
            }
            //Fail

            callback(new Error(`Connection to IP ${address} not allowed`));
            return;
        });
    };

    return filter;
};

exports.http = function (settings) {

    const httpAgent = new Http.Agent(settings.agent);

    httpAgent._oldCreateConnection_ = httpAgent.createConnection;
    httpAgent.createConnection = function (options, ...args) {

        options.lookup = lookup(settings);

        return this._oldCreateConnection_(options, ...args);
    };

    return httpAgent;
};

exports.https = function (settings) {

    const httpsAgent = new Https.Agent(settings.agent);

    httpsAgent._oldCreateConnection_ = httpsAgent.createConnection;
    httpsAgent.createConnection = function (options, ...args) {

        options.lookup = lookup(settings);

        return this._oldCreateConnection_(options, ...args);
    };

    return httpsAgent;
};
