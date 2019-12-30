/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
	.controller('specialtyOffer', ['$scope', '$rootScope', '$location', '$http', '$anchorScroll', function($scope, $rootScope, $location, $http, $anchorScroll) {
		//获取url参数
		var query = $location.search().id;
		$scope.data = {};
		var pagesNumber=0;
		var pagesLength=4;
		$scope.data.promotionId = query;
		//暂时使用id为531的测试数据
		//$scope.data.promotionId = "86";
		$scope.data.offset = pagesNumber;
		$scope.data.length = pagesLength;
		var getSpecialtyOffer = function() {
			$http.post(baseUrl + 'pc/promotion/promotionProducts', $scope.data).success(function(result) {			
				if(result.error == 0) {
					$scope.dataProduct = result.data;
				}
			});
		}
		getSpecialtyOffer();

		//直接购买
		$scope.comfirmOrder = function(id) {
			window.location.href = 'index.html#/product?id=' + id;
		}
		//加入购物车
		$scope.shoppingCart = function(id) {
			window.location.href = 'index.html#/product?id=' + id;
		}
		//点击查看更多
		$scope.viewMore = function(){
			$scope.data.length  = $scope.data.length+pagesLength;
			$scope.data.offset = pagesNumber;
			alert($scope.data.length)
			$http.post(baseUrl + 'pc/promotion/promotionProducts', $scope.data).success(function(result) {			
				if(result.error == 0) {
					$scope.dataProduct = result.data;
				}
			});
		}
	}]);