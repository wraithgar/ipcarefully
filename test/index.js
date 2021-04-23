'use strict'

const lab = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const { describe, it } = lab

const IPCarefully = require('../')
const Http = require('http')
const Https = require('https')

describe('http', () => {
  describe('blacklist', () => {
    const blacklist = ['127.0.0.1']
    const agent = IPCarefully.http({ type: 'blacklist', iplist: blacklist })

    it('does not allow blacklisted IP', () => {
      const request = Http.request({ host: 'localhost', agent })
      return new Promise((resolve, reject) => {
        request.on('error', (err) => {
          expect(err.message).to.include('Connection to IP')
          resolve()
        })
      })
    })

    it('allows non blacklisted IP', () => {
      const request = Http.request({ host: 'google.com', agent })
      return new Promise((resolve, reject) => {
        request.on('socket', (socket) => {
          expect(socket).to.exist()
          resolve()
        })
      })
    })
  })

  describe('whitelist', () => {
    const whitelist = ['127.0.0.1']
    const agent = IPCarefully.http({ type: 'whitelist', iplist: whitelist })

    it('does not allow non whitelisted IP', () => {
      const request = Http.request({ host: 'google.com', agent })
      return new Promise((resolve, reject) => {
        request.on('error', (err) => {
          expect(err.message).to.include('Connection to IP')
          resolve()
        })
      })
    })

    it('allows whitelisted IP', () => {
      const request = Http.request({ host: 'localhost', agent })
      return new Promise((resolve, reject) => {
        request.on('error', (err) => {
          // Should get a connection refused error
          expect(err.message).to.not.include('Connection to IP')
          resolve()
        })
      })
    })
  })
})

describe('https', () => {
  describe('blacklist', () => {
    const blacklist = ['127.0.0.1']
    const agent = IPCarefully.https({ type: 'blacklist', iplist: blacklist })

    it('does not allow blacklisted IP', () => {
      const request = Https.request({ host: 'localhost', agent })
      return new Promise((resolve, reject) => {
        request.on('error', (err) => {
          expect(err.message).to.include('Connection to IP')
          resolve()
        })
      })
    })

    it('allows non blacklisted IP', () => {
      const request = Https.request({ host: 'google.com', agent })
      return new Promise((resolve, reject) => {
        request.on('socket', (socket) => {
          expect(socket).to.exist()
          resolve()
        })
      })
    })
  })
})
