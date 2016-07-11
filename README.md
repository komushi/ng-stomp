# ngStomp

> [STOMP](http://jmesnil.net/stomp-websocket/doc/) promised for [AngularJS](https://angularjs.org)

## Installation

### Install via Bower:
```bash
bower install --save ng-stomp-notify
```

#### Add standalone version (dependencies included) to your HTML file
```html
<script src="bower_components/ng-stomp-notify/dist/ng-stomp.standalone.min.js"></script>
```

#### Or add SockJS + STOMP + (minified) ngStomp individually:
```html
<script src="bower_components/sockjs/sockjs.min.js"></script>
<script src="bower_components/stomp-websocket/lib/stomp.min.js"></script>
<script src="bower_components/ng-stomp-notify/dist/ng-stomp.min.js"></script>
```
----

## Usage
Inject it in your controller:
```js
var app =  angular.module('ngStompExampleApp', ['ngStomp']);

app.controller('stompController', ['$scope', '$stomp', function($scope, $stomp){

    $scope.connect = function () {
        var connectHeaders = {};
        connectHeaders.login = $scope.model.usr;
        connectHeaders.passcode = $scope.model.pwd;

        $stomp.connect($scope.model.url, connectHeaders)
            .then(function (frame) {
                console.log('Connected: ' + frame);
            })
            .catch(function(reason) {
                console.error('Connection error:', reason);
            });
    };

    // Disconnect
    $scope.disconnect = function () {
        $stomp.disconnect().then(
            function () {
                console.log('Disconnected');
            });        
    };
    
    // Subscribe a queue
    $scope.subscribe = function () {
        
        var headers = {};

        $stomp.subscribe($scope.model.subdest, headers).then(null,null, showResponse);
    };

    // notify callback function
    var showResponse = function (res) {
        console.log(JSON.stringify(JSON.parse(res.body)));
    };

    // Unsubscribe a queue
    $scope.unsubscribe = function () {
        $stomp.unsubscribe($scope.model.subdest);
    };

    // Send a message
    $scope.send = function () {
        $stomp.send($scope.model.pubdest, JSON.parse($scope.model.payload), JSON.parse($scope.model.headers));
    };

    var initialize = function () {
        $scope.model = {}

        $scope.model.url = 'ws://127.0.0.1:15674/ws';
        $scope.model.usr = 'guest';
        $scope.model.pwd = 'guest';
        $scope.model.subdest = '/topic/dest';
        $scope.model.pubdest = '/topic/dest';
        $scope.model.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.model.headers = '{}';
    };

    initialize();

}]);
```

## API-Docs (TBD)
- setDebug(callback)
- connect(endpoint, headers)
- disconnect
- subscribe(destination)
- on(destination)
- unsubscribe(destination)
- off(destination)
- send(destination, body, headers)