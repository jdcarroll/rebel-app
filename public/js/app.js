var app = angular.module("rebel-app", ["ngRoute"])
    .config(function($routeProvider){
      $routeProvider
          .when("/",{
                templateUrl: "views/templates/dashboard.html",
                controller: "dashboardCRTL"
          })
          .otherwise({
                redirectTo: "/"
          })
    }).controller("dashboardCRTL", function($scope, socket){
        console.log('hello from dashboard CTRL')
        $scope.buttonPress = function() {
            console.log('button pressed');
            var send = 'on';
            socket.emit('buttonPress', send)
        }
        socket.on('buttonPress', function(data) {
          console.log(data)
        })
    })

app.factory('socket', function ($rootScope) {
  var socket = io('http://localhost:4000');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
