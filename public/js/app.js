var app = angular.module("rebel-app", ["ngRoute"])
    .config(function($routeProvider){
      $routeProvider
          .when("/",{
                templateUrl: "views/templates/dashboard",
                controller: "dashboardCRTL"
          })
          .when('/settings',{
                templateUrl: "views/templates/settings",
                controller: "settingsCTRL"
          })
          .otherwise({
                redirectTo: "/"
          });

    }).controller("dashboardCRTL", function($scope, socket){

      var onProgress = function() {
        console.log('change')
      }

      $scope.title = '';      
      $scope.msgDiv = document.getElementById("msg");
      
      var onTestCompleted = function(testResult) {
        $scope.title = "Speed Test Results";
        $scope.result = testResult;
        console.log($scope.result.download);
        $scope.$apply();

      }

      SomApi.account = "SOM55f2730ada636";   //your API Key here
      SomApi.domainName = "localhost";      //your domain or sub-domain here 
      SomApi.config.sustainTime = 4; 
      SomApi.onTestCompleted = onTestCompleted;
      SomApi.onError = $scope.onError
      SomApi.onProgress = onProgress;
      SomApi.config.progress.enabled = true
      SomApi.config.progress.verbose = true
     
      count = 0;
      turnOn = '';
      $scope.btnStartClick = function() {
        $scope.title = "Speed Test in Procress...";
        SomApi.startTest();
        console.log('buttonPress');
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

// .controller('settingsCTRL',function($scope, $http){
//     console.log('Hello From settings Ctrl')
// })

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
