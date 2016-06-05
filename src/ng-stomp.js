/**
 * ngStomp
 *
 * @version 0.6.1
 * @author Lei Xu <komushi@gmail.com>
 * @license MIT
 */

/*global
    angular, SockJS, Stomp */

(function (factory) {
  'use strict'
  if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      typeof angular !== 'undefined' ? angular : require('angular'),
      typeof SockJS !== 'undefined' ? SockJS : require('SockJS'),
      typeof Stomp !== 'undefined' ? Stomp : require('Stomp')
  )
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'SockJS', 'Stomp'], factory)
  } else {
    // Browser globals
    factory(angular, SockJS, Stomp)
  }
}(function (angular, SockJS, Stomp) {
  angular
  .module('ngStomp', [])
  .service('$stomp', [
    '$rootScope', '$q',
    function ($rootScope, $q) {
      this.sock = null
      this.stomp = null
      this.debug = null

      function isConnected () {
        return this.stomp && this.stomp.connected
      }

      function parseURI (uri) {
        var parser = document.createElement('a')
        parser.href = uri
        return parser
      }

      this.setDebug = function (callback) {
        this.debug = callback
      }

      this.connect = function (endpoint, headers) {
        headers = headers || {}

        var dfd = $q.defer()

        if (parseURI(endpoint).protocol === 'ws:' || parseURI(endpoint).protocol === 'wss:') {
          var ws = new WebSocket(endpoint)
          this.stomp = Stomp.over(ws)
        } else {
          this.sock = new SockJS(endpoint)
          this.stomp = Stomp.over(this.sock)
        }

        this.stomp.debug = this.debug
        this.stomp.connect(headers, function (frame) {
          dfd.resolve(frame)
        }, function (err) {
          dfd.reject(err)
        })

        return dfd.promise
      }

      this.disconnect = function () {
        var dfd = $q.defer()
        if (isConnected()) {
          this.stomp.disconnect(dfd.resolve)
        } else {
          dfd.resolve()
        }
        return dfd.promise
      }

      this.subscriptions = {}

      this.subscribe = this.on = function (destination, headers) {
        headers = headers || {}

        var dfd = $q.defer()

        if (!this.subscriptions[destination]) {
          var sub = this.stomp.subscribe(destination, function (res) {
            dfd.notify(res)
          }, headers)

          this.subscriptions[destination] = sub
        }

        return dfd.promise
      }

      this.unsubscribe = this.off = function (destination) {
        if (this.subscriptions[destination]) {
          this.subscriptions[destination].unsubscribe()
          delete this.subscriptions[destination]
        }
      }

      this.send = function (destination, body, headers) {
        var dfd = $q.defer()
        try {
          var payloadJson = JSON.stringify(body)
          headers = headers || {}
          this.stomp.send(destination, headers, payloadJson)
          dfd.resolve()
        } catch (e) {
          dfd.reject(e)
        }
        return dfd.promise
      }
    }]
  )
}))
