pickupAddressForm/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute']).controller('AboutUsCtrl',['$scope','$http','$anchorScroll','$sce','$rootScope','$location', function ($scope, $http, $anchorScroll,$sce,$rootScope,$location) {
	$scope.list = {};
	$scope.content = "";
	$scope.data = {};
	$scope.id = $location.search().id;
	var getAllHelpLinks=function(){
        $http.post(baseUrl + 'pc/helpLink/many').success(function (result) {
            if(result.error >0) {

            } else {
                $scope.list= result.data;
            }
        });
    }
    getAllHelpLinks();
    
    var getItem=function(){
    	$scope.data.id = $scope.id;
        $http.post(baseUrl + 'pc/helpLink/get',$scope.data).success(function (result) {
        	if(result.error == 0) {
	        	$scope.content = $sce.trustAsHtml(result.data.content);
	        }
        });
    }
    getItem();
	
	
    $rootScope.clickMenu=function(id){
    	$scope.data.id = id;
		$http.post(baseUrl+'pc/helpLink/get',$scope.data).success(function(result){
	        if(result.error == 0) {
	        	$scope.content = $sce.trustAsHtml(result.data.content);
	        }
	    });
	}
    
	
}]);
