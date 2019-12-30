/**
 * Created by admin on 2016/9/12.
 */
var app = angular.module('app', ['ngRoute'])
	.controller('couponProduct', ['$scope', '$rootScope', '$location', '$http', '$anchorScroll', function($scope, $rootScope, $location, $http, $anchorScroll) {
		//获取url参数

		var query = $location.search().id;
		let src = $location.search().src;
		console.log(src)
		$scope.testSrc = src;
		$scope.data = {};
		var pageNumber=1;
		var pageSize=4;
		$scope.data.id = query;
		$scope.data.type = 2;
		//暂时使用id为531的测试数据
		//$scope.data.promotionId = "86";
		$scope.data.pageNumber = pageNumber;
		$scope.data.pageSize = pageSize;
		$scope.data.length = pageSize;
		
		var getCouponProduct = function() {
			$http.post(baseUrl + 'pc/coupon/findCouponProducts', $scope.data).success(function(result) {			
				if(result.error == 0) {
					$scope.couponProduct = result.data;
					let arr = $scope.couponProduct;
					arr.map(i=>{
						return i.mainPic?i.mainPic:i.mainPic=$scope.testSrc
					})
				}
			});
		}
		getCouponProduct();
	 
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
			$scope.data.pageNumber = pageNumber;
			$scope.data.pageSize = $scope.data.pageSize+pageSize;
			$http.post(baseUrl + 'pc/coupon/findCouponProducts', $scope.data).success(function(result) {			
				if(result.error == 0) {
					$scope.couponProduct = result.data;
				}
			});
		}
	}]);