/**
 * ngStomp
 *
 * @version 0.7.0
 * @author Lei Xu <komushi@gmail.com>
 * @license MIT
 */

/*global angular, SockJS, Stomp, define */

(function (factory) {
  'use strict';
  if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      typeof angular !== 'undefined' ? angular : require('angular'),
      typeof SockJS !== 'undefined' ? SockJS : require('SockJS'),
      typeof Stomp !== 'undefined' ? Stomp : require('Stomp')
  );
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'SockJS', 'Stomp'], factory);
  } else {
    // Browser globals
    factory(angular, SockJS, Stomp);
  }
}(function (angular, SockJS, Stomp) {
  'use strict';
  angular
  .module('ngStomp', [])
  .service('$stomp', [
    '$rootScope', '$q',
    function ($rootScope, $q) {
      // this.sock = null
      // this.debug = null

      this.stomps = {};

      function parseURI (uri) {
        var parser = document.createElement('a');
        parser.href = uri;
        return parser;
      }

      // this.setDebug = function (callback) {
      //   this.debug = callback
      // }

      this.connect = function (name, endpoint, headers) {
        headers = headers || {};

        var dfd = $q.defer();

        if (parseURI(endpoint).protocol === 'ws:' || parseURI(endpoint).protocol === 'wss:') {
          var ws = new WebSocket(endpoint);
          this.stomps[name] = Stomp.over(ws);
          this.stomps[name].subs = {};
          this.stomps[name].debug = null;
        } else {
          var sock = new SockJS(endpoint);
          this.stomps[name] = Stomp.over(sock);
          this.stomps[name].subs = {};
          this.stomps[name].debug = null;
        }

        // this.stomp.debug = this.debug
        this.stomps[name].connect(headers, function (frame) {
          dfd.resolve(frame);
        }, function (err) {
          dfd.reject(err);
        });

        return dfd.promise;
      };

      this.disconnect = function (name) {
        var dfd = $q.defer();
        if (this.stomps[name] && this.stomps[name].connected) {
          for (var destination in this.stomps[name].subs)
          {
            if(this.stomps[name].subs.hasOwnProperty(destination)) {
                this.unsubscribe(name, destination);
            }
            // sub.unsubscribe()
          } 

          this.stomps[name].disconnect(dfd.resolve);
        } else {
          dfd.resolve();
        }
        return dfd.promise;
      };

      this.subscribe = this.on = function (name, destination, headers) {
        headers = headers || {};

        var dfd = $q.defer();

        if (this.stomps[name]) {
          if (this.stomps[name].connected){
            if (!this.stomps[name].subs[destination]) {
                this.stomps[name].subs[destination] = this.stomps[name].subscribe(destination, function (res) {
                  dfd.notify(res);
              }, headers);
            }
          }
        }

        return dfd.promise;
      };

      this.unsubscribe = this.off = function (name, destination) {
        if (this.stomps[name]) {
          if (this.stomps[name].connected){
            if (this.stomps[name].subs[destination]) {
              this.stomps[name].subs[destination].unsubscribe();
              delete this.stomps[name].subs[destination];
            }
          }
        }
      };

      this.send = function (name, destination, body, headers) {
        var dfd = $q.defer();
        try {
          var payloadJson = JSON.stringify(body);
          headers = headers || {};
          this.stomps[name].send(destination, headers, payloadJson);
          dfd.resolve();
        } catch (e) {
          dfd.reject(e);
        }
        return dfd.promise;
      };
    }]
  );
}));
