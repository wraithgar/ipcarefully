'use strict';

const lab = exports.lab = require('lab').script();
const { expect } = require('code');
const { describe, it } = lab;

//const Nock = require('nock');

const IPCarefully = require('../');
const Http = require('http');
const Https = require('https');

describe('http', () => {

    describe('blacklist', () => {

        const blacklist = ['127.0.0.1'];
        const agent = IPCarefully.http({ type: 'blacklist', iplist: blacklist });

        it('does not allow blacklisted IP', (done) => {

            const request = Http.request({ host: 'localhost', agent });
            request.on('error', (err) => {

                expect(err.message).to.include('Connection to IP');
                done();
            });
        });

        it('allows non blacklisted IP', (done) => {

            const request = Http.request({ host: 'google.com', agent });
            request.on('socket', (socket) => {

                expect(socket).to.exist();
                done();
            });
        });
    });

    describe('whitelist', () => {

        const whitelist = ['127.0.0.1'];
        const agent = IPCarefully.http({ type: 'whitelist', iplist: whitelist });

        it('does not allow non whitelisted IP', (done) => {

            const request = Http.request({ host: 'google.com', agent });
            request.on('error', (err) => {

                expect(err.message).to.include('Connection to IP');
                done();
            });
        });

        it('allows whitelisted IP', (done) => {

            const request = Http.request({ host: 'localhost', agent });
            request.on('error', (err) => {

                //Should get a connection refused error
                expect(err.message).to.not.include('Connection to IP');
                done();
            });
        });
    });
});

describe('https', () => {

    describe('blacklist', () => {

        const blacklist = ['127.0.0.1'];
        const agent = IPCarefully.https({ type: 'blacklist', iplist: blacklist });

        it('does not allow blacklisted IP', (done) => {

            const request = Https.request({ host: 'localhost', agent });
            request.on('error', (err) => {

                expect(err.message).to.include('Connection to IP');
                done();
            });
        });

        it('allows non blacklisted IP', (done) => {

            const request = Https.request({ host: 'google.com', agent });
            request.on('socket', (socket) => {

                expect(socket).to.exist();
                done();
            });
        });
    });
});
