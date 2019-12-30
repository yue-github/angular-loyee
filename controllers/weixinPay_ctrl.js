/**
 * Created by admin on 2016/9/1.
 */
var app = angular.module('app', ['ngRoute', 'ngSanitize'])
    .controller('weixinPayCtrl', ['$scope','$interval','$location', '$http', '$sce', '$anchorScroll','$rootScope', function ($scope,$interval,$location, $http, $sce, $anchorScroll, $rootScope) {
        $anchorScroll();
        $scope.path=$location.search().path;
        $scope.theType = $location.search().theType;
        $scope.theSameOrderNum = $location.search().theSameOrderNum;
        $scope.orderId = $location.search().orderId;
		$scope.totailTime=300;
		$scope.clearTime = 4;
		$scope.STime = 59;
        $timer = $interval(function(){
			$scope.totailTime=$scope.totailTime-1;
			$scope.clearTime=Math.floor($scope.totailTime/60);
			$scope.STime=$scope.totailTime%60;
			if($location.search().path){
				if ($scope.theType == 1) {
					isPayByTheSameOrderNum($scope,$http,$scope.theSameOrderNum,$timer);
				} else if ($scope.theType == 2) {
					isPayByOrderId($scope,$http,$scope.orderId,$timer);
				}
				if($scope.clearTime==0){
					clearTimeout($timer);
					$byLayer.msg('支付失败！', 'failed',function(){
						window.location.href="#/home";
					});
					window.location.href="#/home";
				}
			}else{
				clearTimeout($timer);
			}
        },1000)
    }]);
