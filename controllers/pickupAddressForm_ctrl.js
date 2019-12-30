/**
 * Created by admin on 2016/9/7.
 */
var app = angular.module('app', ['ngRoute']).controller('pickupAddressFormCtrl',['$scope','$http','$anchorScroll','$sce','$rootScope','$location', function ($scope, $http, $anchorScroll,$sce,$rootScope,$location) {
	
	$scope.shopmenu=8;
	$scope.id = $location.search().id;
	$scope.data = {};
	$scope.data.province_id = 0;
	$scope.data.city_id = 0;
	$scope.data.district_id = 0;
	$scope.provinces = [];
	$scope.cities = [];
	$scope.districts = [];
	
	// 自提地点详情
	$scope.get = function(id) {
		$http.post(baseUrl+'pc/pickup_address/get', {id: id}).success(function(result){
			if (result.error == 0) {
				$scope.data = result.data;
				cities($scope.data.province_id);
				districts($scope.data.city_id);
			}
        });
	}
	
	if ($scope.id > 0) {
		$scope.get($scope.id);
	}
	
	// 保存
	$scope.submit = function() {
		if (!$scope.data.title) {
			$byLayer.msg('请填写名称', 'failed');
			return;
		}
		if (!$scope.data.province_id) {
			$byLayer.msg('请选择省', 'failed');
			return;
		}
		if (!$scope.data.city_id) {
			$byLayer.msg('请选择市', 'failed');
			return;
		}
		if (!$scope.data.district_id) {
			$byLayer.msg('请选择区', 'failed');
			return;
		}
		if (!$scope.data.detail_address) {
			$byLayer.msg('请填写地址', 'failed');
			return;
		}
		if ($scope.id > 0) {
			$http.post(baseUrl+'pc/pickup_address/update', $scope.data).success(function(result){
				if (result.error == 0) {
					$byLayer.msg('保存成功', 'success');
					window.location.href = '#/pickupAddress';
				} else {
					$byLayer.msg('保存失败', 'failed');
					window.location.href = '#/pickupAddress';
				}
	        });
		} else {
			$http.post(baseUrl+'pc/pickup_address/create', $scope.data).success(function(result){
				if (result.error == 0) {
					$byLayer.msg('保存成功', 'success');
					window.location.href = '#/pickupAddress';
				}
	        });
		}
	}
	
	// 选择省
	$scope.selectProvince = function() {
		$scope.cities = [];
		$scope.districts = [];
		cities($scope.data.province_id);
	}
	
	// 选择市
	$scope.selectCity = function() {
		$scope.districts = [];
		districts($scope.data.city_id);
	}
	
	function provinces() {
		$http.post(baseUrl+'pc/pickup_address/provinces', {}).success(function(result){
			if (result.error == 0) {
				$scope.provinces = result.data;
			}
        });
	}
	
	provinces();
	
	function cities(id) {
		$http.post(baseUrl+'pc/pickup_address/cities?province_id='+id, {}).success(function(result){
			if (result.error == 0) {
				$scope.cities = result.data;
			}
        });
	}
	
	function districts(id) {
		$http.post(baseUrl+'pc/pickup_address/districts?city_id='+id, {}).success(function(result){
			if (result.error == 0) {
				$scope.districts = result.data;
			}
        });
	}
	
}]);
