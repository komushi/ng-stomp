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
angular.module('Ctrl')
    .controller('stompgridController', ['$scope', '$stomp', function($scope, $stomp){

    // Connect
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
        $stomp.connect().then(
            function () {
                console.log('Disconnected');
            });        
    };
    
    // Subscribe a queue
    $scope.subscribe = function () {
        $stomp.subscribe($scope.model.queue).then(null,null,updateGrid);
    };

    // Unsubscribe a queue
    $scope.unsubscribe = function () {
        $stomp.unsubscribe($scope.model.queue);
    };

    // Send a message
    $scope.send = function () {
        $stomp.send($scope.model.dest, JSON.parse($scope.model.payload), JSON.parse($scope.model.headers));
    };

    // Notify callback function
    var updateGrid = function (res) {
        $scope.model.rowCollection.push(JSON.parse(res.body));
    };

    var initialize = function () {
        $scope.model = {}
        $scope.model.url = 'http://localhost:15674/stomp';
        $scope.model.usr = 'guest';
        $scope.model.pwd = 'guest';
        $scope.model.queue = '/topic/dest';
        $scope.model.dest = '/topic/dest';
        $scope.model.payload = '{"key":"value"}';
        $scope.model.headers = '{}';
        $scope.model.rowCollection = [];
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