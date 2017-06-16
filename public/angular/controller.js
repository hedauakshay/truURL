/**
 * http://usejsdoc.org/
 */
var app = angular.module('myApp', []);

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

app.controller('myCtrl', ['$scope','$http', function($scope,$http) {
	console.log("Inside controller");
	$scope.submit = function(){
		console.log("Inside controller 2");	
		console.log($scope.url);
		var url = $scope.url;
		if(isUrlValid(url)){
			$http({
				method:"POST",
				url:'/tryURL',
				data: {"url": url}
				}).then(function successCallback(res) {
					console.log(res.data.data);
					
				}, function errorCallback(err) {
						console.log(err);
				});
			}
		}
}]);
