var app = angular.module("rebel-app", ["ngRoute"])
    .config(function($routeProvider){
      $routeProvider
          .when("/",{
                templateUrl: "views/templates/dashboard",
                controller: "dashboardCTRL"
          })
          .when('/settings',{
                templateUrl: "views/templates/settings",
                controller: "settingsCTRL"
          })
          .otherwise({
                redirectTo: "/"
          });

    })

app.controller("dashboardCTRL", function($scope, socket){

      var onProgress = function() {
        console.log('change')
      }

      $scope.title = '';      
      $scope.msgDiv = document.getElementById("msg");
      
      var onTestCompleted = function(testResult) {
        $scope.title = "Speed Test Results";
        $scope.result = testResult;
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
      var chunk = [];
      var packetSize_total = 0;
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
          //starting to manipulate packet data
            console.log(data);
            chunk.push(data);
            if (chunk.length == 10){
                count = 1;
                socket.emit('buttonPress', turnOn);
                var start = chunk[0].pcap_header.tv_sec,
                    start_mil = chunk[0].pcap_header.tv_usec,
                    end = chunk[9].pcap_header.tv_sec,
                    end_mil = chunk[9].pcap_header.tv_usec

                var startTime = Number(start.toString() + "." + start_mil.toString());
                var endTime = Number(end.toString() + "." + end_mil.toString());
                
                var time = endTime - startTime;
                
                chunk.forEach(function(e){
                   packetSize_total += e.pcap_header.len
                })    
                
                var bandwidth = ((packetSize_total / time) / chunk.length);
                console.log("Bandwith: " + bandwidth + "MPS")
                obj = {
                    starting_packet: startTime,
                    bandwidth: bandwidth,
                    ending_packet: endTime
                }

                socket.emit('bandwidth', obj);
                    
                chunk = [];
            }
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
