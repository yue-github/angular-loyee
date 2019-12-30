
var app = angular.module('app', ['ngRoute']).controller('GoodsListCtrl',['$scope','$http','$anchorScroll','$sce','$rootScope','$location', function ($scope, $http, $anchorScroll,$sce,$rootScope,$location) {
	$scope.list = {};
	$scope.data = {};
	$scope.data.length=24;
    $scope.data.offset=0;
    $scope.pages=[];
    $scope.data.i = 1;
	$scope.name = $location.search().name;
	$scope.data.cateName = $scope.name;
	/*var getGoodsByName=function(){
		$scope.data.cateName = $scope.name;
        $http.post(baseUrl + 'pc/products/products',$scope.data).success(function (result) {
            if(result.error >0) {

            } else {
                $scope.list= result.data;
            }
        });
    }*/
	$scope.salesVolume = function(){
    	$scope.data.sort = "salesVolume";
    	getproducts($scope,$http,$scope.data);
    	remove_addClass("salesVolume");
    }
    //价格排序
    $scope.suggestedRetailUnitPrice = function(){
    	if($scope.data.i == 1){
    		$scope.data.sort = "suggestedRetailUnitPrice";
    		$scope.data.i++;
    	} else if($scope.data.i == 2) {
    		$scope.data.sort = "suggestedRetailUnitPrice desc";
    		$scope.data.i--;
		}
    	getproducts($scope,$http,$scope.data);
    	remove_addClass("suggestedRetailUnitPrice");
    }
    $scope.commentNum = function(){
    	$scope.data.sort = "commentNum";
    	getproducts($scope,$http,$scope.data);
    	remove_addClass("commentNum");
    }
	getproducts($scope,$http,$scope.data);

    var getItem=function(){
    	$scope.data.id = $scope.id;
        $http.post(baseUrl + 'pc/helpLink/get',$scope.data).success(function (result) {
        	if(result.error == 0) {
	        	$scope.content = $sce.trustAsHtml(result.data.content);
	        }
        });
    }

    
	
}]);
