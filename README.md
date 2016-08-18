# ngStomp
## Multiple destinations and topics supported
[STOMP](http://jmesnil.net/stomp-websocket/doc/) promised for [AngularJS](https://angularjs.org)

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
        connectHeaders.login = $scope.stomp.usr;
        connectHeaders.passcode = $scope.stomp.pwd;

        $stomp.connect($scope.stomp.name, $scope.stomp.url, connectHeaders)
            .then(function (frame) {
                console.log('Connected: ' + frame);
            })
            .catch(function(reason) {
                console.error('Connection error:', reason);
            });
    };

    // Disconnect
    $scope.disconnect = function () {
        $stomp.disconnect($scope.stomp.name).then(
            function () {
                console.log('Disconnected');
            });        
    };
    
    // Subscribe a queue
    $scope.subscribe = function () {
        
        var headers = {};

        $stomp.subscribe($scope.stomp.name, $scope.stomp.subdest, headers).then(null,null, showResponse);
    };

    // notify callback function
    var showResponse = function (res) {
        console.log(JSON.stringify(JSON.parse(res.body)));
    };

    // Unsubscribe a queue
    $scope.unsubscribe = function () {
        $stomp.unsubscribe($scope.stomp.name, $scope.stomp.subdest);
    };

    // Send a message
    $scope.send = function () {
        $stomp.send($scope.stomp.name, $scope.stomp.pubdest, JSON.parse($scope.stomp.payload), JSON.parse($scope.stomp.headers));
    };

    var initialize = function () {
        $scope.stomp = {}

        $scope.stomp.url = 'ws://127.0.0.1:15674/ws';
        $scope.stomp.usr = 'guest';
        $scope.stomp.pwd = 'guest';
        $scope.stomp.subdest = '/topic/dest';
        $scope.stomp.pubdest = '/topic/dest';
        $scope.stomp.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.stomp.headers = '{}';
        $scope.stomp.name = 'rabbitmq_test';
    };

    initialize();

}]);
```