var app = angular.module("rebel-app", ["ngRoute"])
    .config(function($routeProvider){
      $routeProvider
          .when("/",{
                templateUrl: "views/templates/dashboard",
                controller: "dashboardCRTL"
          })
          .otherwise({
                redirectTo: "/"
          })
    }).controller("dashboardCRTL", function($scope, socket){

      SomApi.account = "SOM524dca9d0aae6";   //your API Key here
      SomApi.domainName = "localhost";      //your domain or sub-domain here 
      SomApi.config.sustainTime = 4; 
      SomApi.onTestCompleted = $scope.onTestCompleted;
      SomApi.onError = $scope.onError;

      $scope.msgDiv = document.getElementById("msg");
      
      count = 0;
      turnOn = '';
      $scope.btnStartClick = function() {
        $scope.msgDiv.innerHTML = "<h3>Speed test in progress. Please wait...</h3>";
        SomApi.startTest();
        console.log('buttonPress');
      }
      
      $scope.onTestCompleted = function(testResult) {
        $scope.msgDiv.innerHTML = 
        "<h3>"+
          "Download: "   +testResult.download +"Mbps <br/>"+
          "Upload: "     +testResult.upload   +"Mbps <br/>"+
          "Latency: "    +testResult.latency  +"ms <br/>"+
          "Jitter: "     +testResult.jitter   +"ms <br/>"+
          "Test Server: "+testResult.testServer +"<br/>"+
          "IP: "         +testResult.ip_address +"<br/>"+
          "Hostname: "   +testResult.hostname +"<br/>"+
        "</h3>";
      }
      
      $scope.onError = function(error) {
        $scope.msgDiv.innerHTML = "Error "+ error.code + ": "+error.message;
      }
        
        $scope.buttonPress = function() {
            console.log('button pressed');
            if (count == 0){
                 turnOn = 'on';
                 count = 1;
            }else if (count == 1){
                turnOn = 'off';
                count = 0;
            }
            socket.emit('buttonPress', turnOn)
        }
        socket.on('buttonPress', function(data) {
          console.log(data)
        })
    })

app.factory('socket', function ($rootScope) {
  var socket = io('http://localhost:80');
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
