
var app = angular.module('app', ['ngRoute']).controller('promotionNavCtrl',['$scope','$http','$anchorScroll','$sce','$rootScope','$location', function ($scope, $http, $anchorScroll,$sce,$rootScope,$location) {
	$scope.list = [];
	var getBrands=function(){
	    $http.post(baseUrl+"pc/product_brand/getList",{}).success(function (result) {
	    	var getProducts = function(data) {
	    		$http.post(baseUrl+"pc/product_brand/getProducts",{id: data.id}).success(function (res) {
        			data.products = res.data;
        		});
	    	}
	        if(result.error === 0) {
	        	var data = result.data;
	        	for(var i = 0; i < data.length; i++) {
	        		getProducts(data[i]);
	        	}
	        	
	        	$scope.list = data;
	        } 
	    });
	}

	getBrands();
}]);
